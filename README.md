# NEXUS Tech Store

Tienda online de hardware de alto rendimiento.

## Estructura del proyecto

```
nexus-store/
├── pages/              # 21 páginas principales
│   ├── index.html      # Inicio
│   ├── productos.html  # Catálogo completo
│   ├── gaming.html     # Configurador de PC gaming
│   ├── carrito.html    # Carrito de compra
│   ├── perfil.html     # Panel de usuario
│   ├── comparar.html   # Comparador de productos
│   └── ...
├── products/           # 69 páginas de producto individual
│   ├── producto-rtx-5090.html
│   └── ...
└── assets/
    ├── css/
    │   └── style.css           # Estilos globales
    ├── js/
    │   ├── app.js              # Lógica principal (carrito, auth)
    │   ├── nexus-extras.js     # 28 módulos UX (wishlist, comparador, chat...)
    │   ├── nexus-ai-chat.js    # Asistente IA (Claude API)
    │   ├── nexus-pwa.js        # PWA install + push notifications
    │   └── sw.js               # Service Worker (offline + caché)
    └── data/
        └── manifest.json       # PWA manifest
```

## Características

- 🎮 Configurador de PC gaming con alertas de compatibilidad
- 🤖 Chat con IA integrado (Claude API)
- 📱 PWA instalable (Android/iOS/PC)
- 🛒 Carrito con códigos de descuento
- ❤️ Lista de deseos
- ⚖️ Comparador de hasta 3 productos
- 🏆 Sistema de logros y XP
- 🌙 Modo oscuro/claro
- 📊 Historial de precios (sparkline)
- 🔍 Búsqueda en tiempo real

## Uso

Abre `pages/index.html` en tu navegador o despliega en cualquier servidor web estático.

Para el chat con IA necesitas configurar la Anthropic API key en `nexus-ai-chat.js`.
