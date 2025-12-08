<?php
/**
 * Meta Boxes para Eventos
 */

if (!defined('ABSPATH')) {
    exit;
}

class MCClub_Meta_Boxes {

    public function __construct() {
        add_action('add_meta_boxes', [$this, 'add_evento_meta_boxes']);
        add_action('save_post_evento', [$this, 'save_evento_meta']);
        add_action('rest_api_init', [$this, 'register_meta_fields']);
    }

    /**
     * Agregar meta box a eventos
     */
    public function add_evento_meta_boxes() {
        add_meta_box(
            'evento_detalles',
            __('Detalles del Evento', 'mcclub'),
            [$this, 'render_meta_box'],
            'evento',
            'normal',
            'high'
        );
    }

    /**
     * Renderizar meta box
     */
    public function render_meta_box($post) {
        wp_nonce_field('evento_meta_nonce', 'evento_nonce');

        $fecha = get_post_meta($post->ID, 'fecha_evento', true);
        $hora_inicio = get_post_meta($post->ID, 'hora_inicio', true);
        $hora_fin = get_post_meta($post->ID, 'hora_fin', true);
        $ubicacion = get_post_meta($post->ID, 'ubicacion', true);
        $plazas = get_post_meta($post->ID, 'plazas', true);
        $permite_inscripcion = get_post_meta($post->ID, 'permite_inscripcion', true);

        // Contar inscripciones actuales
        $inscritos = $this->count_inscripciones($post->ID);
        ?>
        <style>
            .mcclub-meta-table { width: 100%; }
            .mcclub-meta-table th { text-align: left; padding: 10px 10px 10px 0; width: 150px; }
            .mcclub-meta-table td { padding: 10px 0; }
            .mcclub-meta-table input[type="text"],
            .mcclub-meta-table input[type="date"],
            .mcclub-meta-table input[type="time"],
            .mcclub-meta-table input[type="number"] { width: 250px; }
            .mcclub-inscritos { background: #f0f0f0; padding: 10px; border-radius: 4px; margin-top: 10px; }
        </style>
        <table class="mcclub-meta-table">
            <tr>
                <th><label for="fecha_evento"><?php _e('Fecha del Evento', 'mcclub'); ?></label></th>
                <td>
                    <input type="date" id="fecha_evento" name="fecha_evento"
                        value="<?php echo esc_attr($fecha); ?>" required>
                </td>
            </tr>
            <tr>
                <th><label for="hora_inicio"><?php _e('Hora de Inicio', 'mcclub'); ?></label></th>
                <td>
                    <input type="time" id="hora_inicio" name="hora_inicio"
                        value="<?php echo esc_attr($hora_inicio); ?>">
                </td>
            </tr>
            <tr>
                <th><label for="hora_fin"><?php _e('Hora de Fin', 'mcclub'); ?></label></th>
                <td>
                    <input type="time" id="hora_fin" name="hora_fin"
                        value="<?php echo esc_attr($hora_fin); ?>">
                </td>
            </tr>
            <tr>
                <th><label for="ubicacion"><?php _e('Ubicacion', 'mcclub'); ?></label></th>
                <td>
                    <input type="text" id="ubicacion" name="ubicacion"
                        value="<?php echo esc_attr($ubicacion); ?>" placeholder="Ej: Sede del club">
                </td>
            </tr>
            <tr>
                <th><label for="plazas"><?php _e('Plazas Disponibles', 'mcclub'); ?></label></th>
                <td>
                    <input type="number" id="plazas" name="plazas"
                        value="<?php echo esc_attr($plazas); ?>" min="0" placeholder="0 = sin limite">
                    <p class="description"><?php _e('Dejar en 0 para plazas ilimitadas', 'mcclub'); ?></p>
                </td>
            </tr>
            <tr>
                <th><label for="permite_inscripcion"><?php _e('Permite Inscripcion Online', 'mcclub'); ?></label></th>
                <td>
                    <label>
                        <input type="checkbox" id="permite_inscripcion" name="permite_inscripcion"
                            value="1" <?php checked($permite_inscripcion, '1'); ?>>
                        <?php _e('Activar inscripciones desde la web', 'mcclub'); ?>
                    </label>
                </td>
            </tr>
        </table>

        <?php if ($post->ID && get_post_status($post->ID) === 'publish'): ?>
        <div class="mcclub-inscritos">
            <strong><?php _e('Inscripciones:', 'mcclub'); ?></strong>
            <?php echo $inscritos; ?>
            <?php if ($plazas > 0): ?>
                / <?php echo $plazas; ?>
            <?php endif; ?>
            <?php if ($inscritos > 0): ?>
                <a href="<?php echo admin_url('edit.php?post_type=inscripcion&evento_id=' . $post->ID); ?>" style="margin-left: 10px;">
                    <?php _e('Ver inscripciones', 'mcclub'); ?>
                </a>
            <?php endif; ?>
        </div>
        <?php endif;
    }

    /**
     * Guardar meta data del evento
     */
    public function save_evento_meta($post_id) {
        // Verificar nonce
        if (!isset($_POST['evento_nonce']) ||
            !wp_verify_nonce($_POST['evento_nonce'], 'evento_meta_nonce')) {
            return;
        }

        // Verificar autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Verificar permisos
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // Guardar campos
        $fields = ['fecha_evento', 'hora_inicio', 'hora_fin', 'ubicacion', 'plazas'];
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                $value = sanitize_text_field($_POST[$field]);
                update_post_meta($post_id, $field, $value);
            }
        }

        // Checkbox de inscripcion
        $permite = isset($_POST['permite_inscripcion']) ? '1' : '0';
        update_post_meta($post_id, 'permite_inscripcion', $permite);
    }

    /**
     * Registrar meta fields en REST API
     */
    public function register_meta_fields() {
        $meta_fields = [
            'fecha_evento'        => ['type' => 'string', 'description' => 'Fecha del evento (YYYY-MM-DD)'],
            'hora_inicio'         => ['type' => 'string', 'description' => 'Hora de inicio (HH:MM)'],
            'hora_fin'            => ['type' => 'string', 'description' => 'Hora de fin (HH:MM)'],
            'ubicacion'           => ['type' => 'string', 'description' => 'Lugar del evento'],
            'plazas'              => ['type' => 'integer', 'description' => 'Numero de plazas disponibles'],
            'permite_inscripcion' => ['type' => 'boolean', 'description' => 'Si acepta inscripciones online'],
        ];

        foreach ($meta_fields as $field => $config) {
            register_post_meta('evento', $field, [
                'show_in_rest'  => true,
                'single'        => true,
                'type'          => $config['type'],
                'description'   => $config['description'],
            ]);
        }

        // Campo calculado: numero de inscritos
        register_rest_field('evento', 'inscritos', [
            'get_callback' => [$this, 'get_inscritos_count'],
            'schema'       => [
                'type'        => 'integer',
                'description' => 'Numero de personas inscritas',
            ],
        ]);
    }

    /**
     * Obtener numero de inscritos para REST API
     */
    public function get_inscritos_count($object) {
        return $this->count_inscripciones($object['id']);
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
}
