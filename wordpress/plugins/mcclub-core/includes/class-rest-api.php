<?php
/**
 * Endpoints REST API personalizados
 */

if (!defined('ABSPATH')) {
    exit;
}

class MCClub_REST_API {

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Registrar rutas REST
     */
    public function register_routes() {
        $namespace = 'mcclub/v1';

        // POST /mcclub/v1/inscripciones - Crear inscripcion
        register_rest_route($namespace, '/inscripciones', [
            'methods'             => 'POST',
            'callback'            => [$this, 'create_inscripcion'],
            'permission_callback' => '__return_true',
            'args'                => [
                'evento_id' => [
                    'required'          => true,
                    'type'              => 'integer',
                    'description'       => 'ID del evento',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && $param > 0;
                    },
                ],
                'nombre' => [
                    'required'          => true,
                    'type'              => 'string',
                    'description'       => 'Nombre del participante',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'email' => [
                    'required'          => true,
                    'type'              => 'string',
                    'format'            => 'email',
                    'description'       => 'Email del participante',
                    'sanitize_callback' => 'sanitize_email',
                ],
                'telefono' => [
                    'required'          => false,
                    'type'              => 'string',
                    'description'       => 'Telefono de contacto',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ]);

        // GET /mcclub/v1/eventos/{id}/inscripciones - Listar inscripciones (admin)
        register_rest_route($namespace, '/eventos/(?P<id>\d+)/inscripciones', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_inscripciones'],
            'permission_callback' => [$this, 'check_admin_permission'],
            'args'                => [
                'id' => [
                    'required'          => true,
                    'type'              => 'integer',
                    'description'       => 'ID del evento',
                ],
            ],
        ]);

        // GET /mcclub/v1/eventos/proximos - Eventos proximos
        register_rest_route($namespace, '/eventos/proximos', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_proximos_eventos'],
            'permission_callback' => '__return_true',
            'args'                => [
                'limit' => [
                    'default'           => 10,
                    'type'              => 'integer',
                    'description'       => 'Numero de eventos a devolver',
                ],
            ],
        ]);
    }

    /**
     * Crear una inscripcion
     */
    public function create_inscripcion($request) {
        $evento_id = $request->get_param('evento_id');
        $nombre    = $request->get_param('nombre');
        $email     = $request->get_param('email');
        $telefono  = $request->get_param('telefono');

        // Verificar que el evento existe
        $evento = get_post($evento_id);
        if (!$evento || $evento->post_type !== 'evento') {
            return new WP_Error(
                'evento_not_found',
                __('Evento no encontrado', 'mcclub'),
                ['status' => 404]
            );
        }

        // Verificar que permite inscripciones
        $permite = get_post_meta($evento_id, 'permite_inscripcion', true);
        if ($permite !== '1') {
            return new WP_Error(
                'inscripciones_cerradas',
                __('Este evento no acepta inscripciones online', 'mcclub'),
                ['status' => 400]
            );
        }

        // Verificar plazas disponibles
        $plazas = (int) get_post_meta($evento_id, 'plazas', true);
        $inscritos = $this->count_inscripciones($evento_id);

        if ($plazas > 0 && $inscritos >= $plazas) {
            return new WP_Error(
                'sin_plazas',
                __('No hay plazas disponibles para este evento', 'mcclub'),
                ['status' => 400]
            );
        }

        // Verificar que no esta ya inscrito
        if ($this->check_duplicate($evento_id, $email)) {
            return new WP_Error(
                'ya_inscrito',
                __('Ya existe una inscripcion con este email para este evento', 'mcclub'),
                ['status' => 400]
            );
        }

        // Crear inscripcion
        $inscripcion_id = wp_insert_post([
            'post_type'   => 'inscripcion',
            'post_title'  => sprintf('%s - %s', $nombre, $evento->post_title),
            'post_status' => 'publish',
        ]);

        if (is_wp_error($inscripcion_id)) {
            return new WP_Error(
                'error_crear',
                __('Error al crear la inscripcion', 'mcclub'),
                ['status' => 500]
            );
        }

        // Guardar meta data
        update_post_meta($inscripcion_id, 'evento_id', $evento_id);
        update_post_meta($inscripcion_id, 'nombre', $nombre);
        update_post_meta($inscripcion_id, 'email', $email);
        update_post_meta($inscripcion_id, 'telefono', $telefono ?: '');
        update_post_meta($inscripcion_id, 'fecha_inscripcion', current_time('mysql'));
        update_post_meta($inscripcion_id, 'estado', 'confirmada');

        return [
            'success'        => true,
            'message'        => __('Inscripcion realizada correctamente', 'mcclub'),
            'inscripcion_id' => $inscripcion_id,
            'evento'         => $evento->post_title,
            'plazas_restantes' => $plazas > 0 ? $plazas - $inscritos - 1 : null,
        ];
    }

    /**
     * Obtener inscripciones de un evento (admin only)
     */
    public function get_inscripciones($request) {
        $evento_id = $request->get_param('id');

        $query = new WP_Query([
            'post_type'      => 'inscripcion',
            'posts_per_page' => -1,
            'meta_key'       => 'evento_id',
            'meta_value'     => $evento_id,
            'orderby'        => 'date',
            'order'          => 'DESC',
        ]);

        $inscripciones = array_map(function($post) {
            return [
                'id'       => $post->ID,
                'nombre'   => get_post_meta($post->ID, 'nombre', true),
                'email'    => get_post_meta($post->ID, 'email', true),
                'telefono' => get_post_meta($post->ID, 'telefono', true),
                'fecha'    => get_post_meta($post->ID, 'fecha_inscripcion', true),
                'estado'   => get_post_meta($post->ID, 'estado', true),
            ];
        }, $query->posts);

        return [
            'evento_id'     => $evento_id,
            'total'         => count($inscripciones),
            'inscripciones' => $inscripciones,
        ];
    }

    /**
     * Obtener proximos eventos
     */
    public function get_proximos_eventos($request) {
        $limit = $request->get_param('limit');
        $today = date('Y-m-d');

        $query = new WP_Query([
            'post_type'      => 'evento',
            'posts_per_page' => $limit,
            'post_status'    => 'publish',
            'meta_key'       => 'fecha_evento',
            'orderby'        => 'meta_value',
            'order'          => 'ASC',
            'meta_query'     => [
                [
                    'key'     => 'fecha_evento',
                    'value'   => $today,
                    'compare' => '>=',
                    'type'    => 'DATE',
                ],
            ],
        ]);

        $eventos = array_map(function($post) {
            $plazas = (int) get_post_meta($post->ID, 'plazas', true);
            $inscritos = $this->count_inscripciones($post->ID);

            return [
                'id'                  => $post->ID,
                'title'               => $post->post_title,
                'slug'                => $post->post_name,
                'excerpt'             => html_entity_decode(wp_strip_all_tags(get_the_excerpt($post))),
                'fecha_evento'        => get_post_meta($post->ID, 'fecha_evento', true),
                'hora_inicio'         => get_post_meta($post->ID, 'hora_inicio', true),
                'hora_fin'            => get_post_meta($post->ID, 'hora_fin', true),
                'ubicacion'           => get_post_meta($post->ID, 'ubicacion', true),
                'plazas'              => $plazas,
                'inscritos'           => $inscritos,
                'plazas_disponibles'  => $plazas > 0 ? max(0, $plazas - $inscritos) : null,
                'permite_inscripcion' => get_post_meta($post->ID, 'permite_inscripcion', true) === '1',
                'imagen'              => get_the_post_thumbnail_url($post->ID, 'medium'),
            ];
        }, $query->posts);

        return [
            'total'   => count($eventos),
            'eventos' => $eventos,
        ];
    }

    /**
     * Verificar permisos de admin
     */
    public function check_admin_permission() {
        return current_user_can('edit_posts');
    }

    /**
     * Contar inscripciones de un evento
     */
    private function count_inscripciones($evento_id) {
        $query = new WP_Query([
            'post_type'      => 'inscripcion',
            'posts_per_page' => -1,
            'meta_query'     => [
                'relation' => 'AND',
                [
                    'key'   => 'evento_id',
                    'value' => $evento_id,
                ],
                [
                    'key'     => 'estado',
                    'value'   => 'cancelada',
                    'compare' => '!=',
                ],
            ],
        ]);
        return $query->found_posts;
    }

    /**
     * Verificar inscripcion duplicada
     */
    private function check_duplicate($evento_id, $email) {
        $query = new WP_Query([
            'post_type'      => 'inscripcion',
            'posts_per_page' => 1,
            'meta_query'     => [
                'relation' => 'AND',
                [
                    'key'   => 'evento_id',
                    'value' => $evento_id,
                ],
                [
                    'key'   => 'email',
                    'value' => $email,
                ],
                [
                    'key'     => 'estado',
                    'value'   => 'cancelada',
                    'compare' => '!=',
                ],
            ],
        ]);
        return $query->have_posts();
    }
}
