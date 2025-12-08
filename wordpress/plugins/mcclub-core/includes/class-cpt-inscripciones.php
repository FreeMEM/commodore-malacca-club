<?php
/**
 * Custom Post Type: Inscripciones
 */

if (!defined('ABSPATH')) {
    exit;
}

class MCClub_CPT_Inscripciones {

    public function __construct() {
        add_action('init', [$this, 'register_post_type']);
        add_filter('manage_inscripcion_posts_columns', [$this, 'set_columns']);
        add_action('manage_inscripcion_posts_custom_column', [$this, 'render_columns'], 10, 2);
    }

    /**
     * Registrar CPT Inscripciones
     */
    public function register_post_type() {
        $labels = [
            'name'               => __('Inscripciones', 'mcclub'),
            'singular_name'      => __('Inscripcion', 'mcclub'),
            'menu_name'          => __('Inscripciones', 'mcclub'),
            'all_items'          => __('Ver Inscripciones', 'mcclub'),
            'search_items'       => __('Buscar Inscripciones', 'mcclub'),
            'not_found'          => __('No se encontraron inscripciones', 'mcclub'),
        ];

        $args = [
            'labels'              => $labels,
            'public'              => false,
            'show_ui'             => true,
            'show_in_menu'        => 'edit.php?post_type=evento',
            'capability_type'     => 'post',
            'hierarchical'        => false,
            'supports'            => ['title'],
            'show_in_rest'        => false,
        ];

        register_post_type('inscripcion', $args);
    }

    /**
     * Columnas personalizadas en admin
     */
    public function set_columns($columns) {
        $new_columns = [];
        $new_columns['cb'] = $columns['cb'];
        $new_columns['title'] = __('Participante', 'mcclub');
        $new_columns['evento'] = __('Evento', 'mcclub');
        $new_columns['email'] = __('Email', 'mcclub');
        $new_columns['telefono'] = __('Telefono', 'mcclub');
        $new_columns['estado'] = __('Estado', 'mcclub');
        $new_columns['fecha'] = __('Fecha Inscripcion', 'mcclub');
        return $new_columns;
    }

    /**
     * Renderizar columnas personalizadas
     */
    public function render_columns($column, $post_id) {
        switch ($column) {
            case 'evento':
                $evento_id = get_post_meta($post_id, 'evento_id', true);
                if ($evento_id) {
                    $evento = get_post($evento_id);
                    if ($evento) {
                        echo '<a href="' . get_edit_post_link($evento_id) . '">' . esc_html($evento->post_title) . '</a>';
                    }
                }
                break;
            case 'email':
                echo esc_html(get_post_meta($post_id, 'email', true));
                break;
            case 'telefono':
                echo esc_html(get_post_meta($post_id, 'telefono', true));
                break;
            case 'estado':
                $estado = get_post_meta($post_id, 'estado', true);
                $estados = [
                    'pendiente' => '<span style="color: orange;">Pendiente</span>',
                    'confirmada' => '<span style="color: green;">Confirmada</span>',
                    'cancelada' => '<span style="color: red;">Cancelada</span>',
                ];
                echo isset($estados[$estado]) ? $estados[$estado] : esc_html($estado);
                break;
            case 'fecha':
                echo esc_html(get_post_meta($post_id, 'fecha_inscripcion', true));
                break;
        }
    }
}
