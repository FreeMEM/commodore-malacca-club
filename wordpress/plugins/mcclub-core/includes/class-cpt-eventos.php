<?php
/**
 * Custom Post Type: Eventos
 */

if (!defined('ABSPATH')) {
    exit;
}

class MCClub_CPT_Eventos {

    public function __construct() {
        add_action('init', [$this, 'register_post_type']);
        add_action('init', [$this, 'register_taxonomy']);
        // Desactivar Gutenberg para Eventos (meta boxes funcionan mejor con editor clasico)
        add_filter('use_block_editor_for_post_type', [$this, 'disable_gutenberg'], 10, 2);
    }

    /**
     * Desactivar Gutenberg para el CPT evento
     */
    public function disable_gutenberg($use_block_editor, $post_type) {
        if ($post_type === 'evento') {
            return false;
        }
        return $use_block_editor;
    }

    /**
     * Registrar CPT Eventos
     */
    public function register_post_type() {
        $labels = [
            'name'               => __('Eventos', 'mcclub'),
            'singular_name'      => __('Evento', 'mcclub'),
            'menu_name'          => __('Eventos', 'mcclub'),
            'add_new'            => __('Añadir Evento', 'mcclub'),
            'add_new_item'       => __('Añadir Nuevo Evento', 'mcclub'),
            'edit_item'          => __('Editar Evento', 'mcclub'),
            'new_item'           => __('Nuevo Evento', 'mcclub'),
            'view_item'          => __('Ver Evento', 'mcclub'),
            'search_items'       => __('Buscar Eventos', 'mcclub'),
            'not_found'          => __('No se encontraron eventos', 'mcclub'),
            'not_found_in_trash' => __('No hay eventos en la papelera', 'mcclub'),
            'all_items'          => __('Todos los Eventos', 'mcclub'),
        ];

        $args = [
            'labels'              => $labels,
            'public'              => true,
            'publicly_queryable'  => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'show_in_rest'        => true,
            'rest_base'           => 'eventos',
            'menu_position'       => 5,
            'menu_icon'           => 'dashicons-calendar-alt',
            'capability_type'     => 'post',
            'has_archive'         => true,
            'hierarchical'        => false,
            'rewrite'             => ['slug' => 'eventos'],
            'supports'            => [
                'title',
                'editor',
                'excerpt',
                'thumbnail',
                'custom-fields',
            ],
        ];

        register_post_type('evento', $args);
    }

    /**
     * Registrar taxonomia para tipos de evento
     */
    public function register_taxonomy() {
        $labels = [
            'name'              => __('Tipos de Evento', 'mcclub'),
            'singular_name'     => __('Tipo de Evento', 'mcclub'),
            'search_items'      => __('Buscar Tipos', 'mcclub'),
            'all_items'         => __('Todos los Tipos', 'mcclub'),
            'edit_item'         => __('Editar Tipo', 'mcclub'),
            'update_item'       => __('Actualizar Tipo', 'mcclub'),
            'add_new_item'      => __('Añadir Nuevo Tipo', 'mcclub'),
            'new_item_name'     => __('Nombre del Nuevo Tipo', 'mcclub'),
            'menu_name'         => __('Tipos de Evento', 'mcclub'),
        ];

        $args = [
            'labels'            => $labels,
            'hierarchical'      => true,
            'public'            => true,
            'show_ui'           => true,
            'show_in_rest'      => true,
            'rest_base'         => 'tipo-evento',
            'show_admin_column' => true,
            'rewrite'           => ['slug' => 'tipo-evento'],
        ];

        register_taxonomy('tipo_evento', ['evento'], $args);
    }
}
