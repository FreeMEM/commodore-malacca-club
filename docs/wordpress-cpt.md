# Custom Post Types WordPress

## Qué son los Custom Post Types (CPT)

WordPress tiene por defecto:
- **Posts** (entradas) - para contenido cronológico (blog, noticias)
- **Pages** (páginas) - para contenido estático

Los CPT permiten crear tipos de contenido personalizados, en nuestro caso: **Eventos**.

## Arquitectura del Plugin

Crearemos un plugin dedicado para los CPT (mejor práctica vs. ponerlo en el tema):

```
wordpress/plugins/mcclub-core/
├── mcclub-core.php           # Archivo principal del plugin
├── includes/
│   ├── class-cpt-eventos.php # Registro del CPT Eventos
│   ├── class-meta-boxes.php  # Campos personalizados
│   └── class-rest-api.php    # Endpoints REST personalizados
└── languages/                # Traducciones (opcional)
```

## Custom Post Type: Eventos

### Campos del Evento

| Campo | Tipo | Descripción |
|-------|------|-------------|
| title | string | Nombre del evento (nativo WP) |
| content | html | Descripción completa (nativo WP) |
| excerpt | string | Resumen corto (nativo WP) |
| featured_image | image | Imagen destacada (nativo WP) |
| fecha_evento | date | Fecha del evento |
| hora_inicio | time | Hora de inicio |
| hora_fin | time | Hora de finalización |
| ubicacion | string | Lugar del evento |
| plazas | int | Número máximo de participantes |
| permite_inscripcion | bool | Si acepta inscripciones online |

### Registro del CPT

```php
<?php
// includes/class-cpt-eventos.php

class MCClub_CPT_Eventos {

    public function __construct() {
        add_action('init', [$this, 'register_post_type']);
        add_action('init', [$this, 'register_taxonomy']);
    }

    public function register_post_type() {
        $labels = [
            'name'               => 'Eventos',
            'singular_name'      => 'Evento',
            'menu_name'          => 'Eventos',
            'add_new'            => 'Añadir Evento',
            'add_new_item'       => 'Añadir Nuevo Evento',
            'edit_item'          => 'Editar Evento',
            'new_item'           => 'Nuevo Evento',
            'view_item'          => 'Ver Evento',
            'search_items'       => 'Buscar Eventos',
            'not_found'          => 'No se encontraron eventos',
            'not_found_in_trash' => 'No hay eventos en la papelera',
        ];

        $args = [
            'labels'              => $labels,
            'public'              => true,
            'publicly_queryable'  => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'show_in_rest'        => true,  // Importante: expone en REST API
            'rest_base'           => 'eventos',
            'menu_icon'           => 'dashicons-calendar-alt',
            'capability_type'     => 'post',
            'has_archive'         => true,
            'hierarchical'        => false,
            'supports'            => [
                'title',
                'editor',
                'excerpt',
                'thumbnail',
                'custom-fields'
            ],
        ];

        register_post_type('evento', $args);
    }

    public function register_taxonomy() {
        // Taxonomía para categorizar eventos (opcional)
        $labels = [
            'name'          => 'Tipos de Evento',
            'singular_name' => 'Tipo de Evento',
        ];

        $args = [
            'labels'            => $labels,
            'hierarchical'      => true,
            'public'            => true,
            'show_in_rest'      => true,
            'rest_base'         => 'tipo-evento',
        ];

        register_taxonomy('tipo_evento', ['evento'], $args);
    }
}
```

### Meta Boxes (Campos Personalizados)

```php
<?php
// includes/class-meta-boxes.php

class MCClub_Meta_Boxes {

    public function __construct() {
        add_action('add_meta_boxes', [$this, 'add_evento_meta_boxes']);
        add_action('save_post_evento', [$this, 'save_evento_meta']);
        add_action('rest_api_init', [$this, 'register_meta_fields']);
    }

    public function add_evento_meta_boxes() {
        add_meta_box(
            'evento_detalles',
            'Detalles del Evento',
            [$this, 'render_meta_box'],
            'evento',
            'normal',
            'high'
        );
    }

    public function render_meta_box($post) {
        wp_nonce_field('evento_meta_nonce', 'evento_nonce');

        $fecha = get_post_meta($post->ID, 'fecha_evento', true);
        $hora_inicio = get_post_meta($post->ID, 'hora_inicio', true);
        $hora_fin = get_post_meta($post->ID, 'hora_fin', true);
        $ubicacion = get_post_meta($post->ID, 'ubicacion', true);
        $plazas = get_post_meta($post->ID, 'plazas', true);
        $permite_inscripcion = get_post_meta($post->ID, 'permite_inscripcion', true);
        ?>
        <table class="form-table">
            <tr>
                <th><label for="fecha_evento">Fecha</label></th>
                <td><input type="date" id="fecha_evento" name="fecha_evento"
                    value="<?php echo esc_attr($fecha); ?>"></td>
            </tr>
            <tr>
                <th><label for="hora_inicio">Hora inicio</label></th>
                <td><input type="time" id="hora_inicio" name="hora_inicio"
                    value="<?php echo esc_attr($hora_inicio); ?>"></td>
            </tr>
            <tr>
                <th><label for="hora_fin">Hora fin</label></th>
                <td><input type="time" id="hora_fin" name="hora_fin"
                    value="<?php echo esc_attr($hora_fin); ?>"></td>
            </tr>
            <tr>
                <th><label for="ubicacion">Ubicación</label></th>
                <td><input type="text" id="ubicacion" name="ubicacion"
                    value="<?php echo esc_attr($ubicacion); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="plazas">Plazas disponibles</label></th>
                <td><input type="number" id="plazas" name="plazas"
                    value="<?php echo esc_attr($plazas); ?>" min="0"></td>
            </tr>
            <tr>
                <th><label for="permite_inscripcion">Permite inscripción</label></th>
                <td><input type="checkbox" id="permite_inscripcion" name="permite_inscripcion"
                    value="1" <?php checked($permite_inscripcion, '1'); ?>></td>
            </tr>
        </table>
        <?php
    }

    public function save_evento_meta($post_id) {
        if (!isset($_POST['evento_nonce']) ||
            !wp_verify_nonce($_POST['evento_nonce'], 'evento_meta_nonce')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        $fields = ['fecha_evento', 'hora_inicio', 'hora_fin', 'ubicacion', 'plazas'];
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
            }
        }

        // Checkbox
        $permite = isset($_POST['permite_inscripcion']) ? '1' : '0';
        update_post_meta($post_id, 'permite_inscripcion', $permite);
    }

    // Exponer meta fields en REST API
    public function register_meta_fields() {
        $meta_fields = [
            'fecha_evento' => 'string',
            'hora_inicio' => 'string',
            'hora_fin' => 'string',
            'ubicacion' => 'string',
            'plazas' => 'integer',
            'permite_inscripcion' => 'boolean',
        ];

        foreach ($meta_fields as $field => $type) {
            register_post_meta('evento', $field, [
                'show_in_rest' => true,
                'single' => true,
                'type' => $type,
            ]);
        }
    }
}
```

## Sistema de Inscripciones

### CPT Inscripciones

```php
<?php
// Registro simplificado del CPT inscripciones

register_post_type('inscripcion', [
    'labels' => [
        'name' => 'Inscripciones',
        'singular_name' => 'Inscripción',
    ],
    'public' => false,
    'show_ui' => true,
    'show_in_menu' => 'edit.php?post_type=evento', // Submenú de Eventos
    'supports' => ['title'],
    'show_in_rest' => false, // No exponer directamente
]);
```

### Campos de Inscripción

| Campo | Tipo | Descripción |
|-------|------|-------------|
| evento_id | int | ID del evento relacionado |
| nombre | string | Nombre del participante |
| email | string | Email del participante |
| telefono | string | Teléfono (opcional) |
| fecha_inscripcion | datetime | Cuándo se inscribió |
| estado | enum | pendiente, confirmada, cancelada |

### Endpoint REST Personalizado

```php
<?php
// includes/class-rest-api.php

class MCClub_REST_API {

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        register_rest_route('mcclub/v1', '/inscripciones', [
            'methods' => 'POST',
            'callback' => [$this, 'create_inscripcion'],
            'permission_callback' => '__return_true', // Público
            'args' => [
                'evento_id' => [
                    'required' => true,
                    'type' => 'integer',
                ],
                'nombre' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'email' => [
                    'required' => true,
                    'type' => 'string',
                    'format' => 'email',
                ],
                'telefono' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ]);

        register_rest_route('mcclub/v1', '/eventos/(?P<id>\d+)/inscripciones', [
            'methods' => 'GET',
            'callback' => [$this, 'get_inscripciones'],
            'permission_callback' => [$this, 'check_admin_permission'],
        ]);
    }

    public function create_inscripcion($request) {
        $evento_id = $request->get_param('evento_id');
        $nombre = $request->get_param('nombre');
        $email = $request->get_param('email');
        $telefono = $request->get_param('telefono');

        // Verificar que el evento existe y permite inscripciones
        $evento = get_post($evento_id);
        if (!$evento || $evento->post_type !== 'evento') {
            return new WP_Error('invalid_event', 'Evento no encontrado', ['status' => 404]);
        }

        $permite = get_post_meta($evento_id, 'permite_inscripcion', true);
        if ($permite !== '1') {
            return new WP_Error('inscriptions_closed', 'Este evento no acepta inscripciones', ['status' => 400]);
        }

        // Verificar plazas disponibles
        $plazas = (int) get_post_meta($evento_id, 'plazas', true);
        $inscritos = $this->count_inscripciones($evento_id);
        if ($plazas > 0 && $inscritos >= $plazas) {
            return new WP_Error('no_spots', 'No hay plazas disponibles', ['status' => 400]);
        }

        // Verificar duplicados
        $exists = $this->check_duplicate($evento_id, $email);
        if ($exists) {
            return new WP_Error('duplicate', 'Ya estás inscrito en este evento', ['status' => 400]);
        }

        // Crear inscripción
        $inscripcion_id = wp_insert_post([
            'post_type' => 'inscripcion',
            'post_title' => sprintf('%s - %s', $nombre, $evento->post_title),
            'post_status' => 'publish',
        ]);

        if (is_wp_error($inscripcion_id)) {
            return new WP_Error('create_failed', 'Error al crear inscripción', ['status' => 500]);
        }

        update_post_meta($inscripcion_id, 'evento_id', $evento_id);
        update_post_meta($inscripcion_id, 'nombre', $nombre);
        update_post_meta($inscripcion_id, 'email', $email);
        update_post_meta($inscripcion_id, 'telefono', $telefono);
        update_post_meta($inscripcion_id, 'fecha_inscripcion', current_time('mysql'));
        update_post_meta($inscripcion_id, 'estado', 'confirmada');

        return [
            'success' => true,
            'message' => 'Inscripción realizada correctamente',
            'inscripcion_id' => $inscripcion_id,
        ];
    }

    private function count_inscripciones($evento_id) {
        $query = new WP_Query([
            'post_type' => 'inscripcion',
            'meta_query' => [
                [
                    'key' => 'evento_id',
                    'value' => $evento_id,
                ],
                [
                    'key' => 'estado',
                    'value' => 'cancelada',
                    'compare' => '!=',
                ],
            ],
            'posts_per_page' => -1,
        ]);
        return $query->found_posts;
    }

    private function check_duplicate($evento_id, $email) {
        $query = new WP_Query([
            'post_type' => 'inscripcion',
            'meta_query' => [
                'relation' => 'AND',
                ['key' => 'evento_id', 'value' => $evento_id],
                ['key' => 'email', 'value' => $email],
                ['key' => 'estado', 'value' => 'cancelada', 'compare' => '!='],
            ],
            'posts_per_page' => 1,
        ]);
        return $query->have_posts();
    }

    public function check_admin_permission() {
        return current_user_can('edit_posts');
    }

    public function get_inscripciones($request) {
        $evento_id = $request->get_param('id');

        $query = new WP_Query([
            'post_type' => 'inscripcion',
            'meta_key' => 'evento_id',
            'meta_value' => $evento_id,
            'posts_per_page' => -1,
        ]);

        $inscripciones = array_map(function($post) {
            return [
                'id' => $post->ID,
                'nombre' => get_post_meta($post->ID, 'nombre', true),
                'email' => get_post_meta($post->ID, 'email', true),
                'telefono' => get_post_meta($post->ID, 'telefono', true),
                'fecha' => get_post_meta($post->ID, 'fecha_inscripcion', true),
                'estado' => get_post_meta($post->ID, 'estado', true),
            ];
        }, $query->posts);

        return $inscripciones;
    }
}
```

## Archivo Principal del Plugin

```php
<?php
/**
 * Plugin Name: MCClub Core
 * Description: Funcionalidades core para el sitio del Club Malacca
 * Version: 1.0.0
 * Author: CBM Malacca Club
 * Text Domain: mcclub
 */

if (!defined('ABSPATH')) {
    exit;
}

define('MCCLUB_VERSION', '1.0.0');
define('MCCLUB_PATH', plugin_dir_path(__FILE__));

// Autoload clases
require_once MCCLUB_PATH . 'includes/class-cpt-eventos.php';
require_once MCCLUB_PATH . 'includes/class-meta-boxes.php';
require_once MCCLUB_PATH . 'includes/class-rest-api.php';

// Inicializar
function mcclub_init() {
    new MCClub_CPT_Eventos();
    new MCClub_Meta_Boxes();
    new MCClub_REST_API();
}
add_action('plugins_loaded', 'mcclub_init');

// Activación
register_activation_hook(__FILE__, 'mcclub_activate');
function mcclub_activate() {
    mcclub_init();
    flush_rewrite_rules();
}

// Desactivación
register_deactivation_hook(__FILE__, 'mcclub_deactivate');
function mcclub_deactivate() {
    flush_rewrite_rules();
}
```

## Respuesta API de Eventos

Cuando consultes `/wp-json/wp/v2/eventos`, recibirás:

```json
{
  "id": 123,
  "title": {
    "rendered": "Torneo de Verano"
  },
  "content": {
    "rendered": "<p>Descripción del evento...</p>"
  },
  "excerpt": {
    "rendered": "<p>Resumen corto...</p>"
  },
  "meta": {
    "fecha_evento": "2024-07-15",
    "hora_inicio": "10:00",
    "hora_fin": "14:00",
    "ubicacion": "Sede del club",
    "plazas": 30,
    "permite_inscripcion": true
  },
  "_embedded": {
    "wp:featuredmedia": [...]
  }
}
```

## Plugins Recomendados (Opcionales)

| Plugin | Uso |
|--------|-----|
| ACF (Advanced Custom Fields) | Alternativa visual para meta fields |
| WP REST API Controller | Gestionar qué expone la API |
| JWT Authentication | Si necesitas autenticación en frontend |
