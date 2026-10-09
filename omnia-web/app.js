const siteConfig = {
    contactEmail: "soporte@omnia.com",
    contactPhone: "+1 (800) 555-OMNIA",
    paypalClientId: "sb"
};

const products = [
    { id: 1, key: 'p1', priceUSD: 149.99, category: 'Moda', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' },
    { id: 2, key: 'p2', priceUSD: 119.99, category: 'Calzado', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
    { id: 3, key: 'p3', priceUSD: 199.99, category: 'Accesorios', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
    { id: 4, key: 'p4', priceUSD: 280.00, category: 'Arte', image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500' },
    { id: 5, key: 'p5', priceUSD: 89.99, category: 'Accesorios', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500' },
    { id: 6, key: 'p6', priceUSD: 79.99, category: 'Moda', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500' }
];

const rates = { 
    USD: 1, EUR: 0.92, GBP: 0.79, CAD: 1.35, MXN: 17.1, 
    COP: 3900, ARS: 850, CLP: 950, PEN: 3.75, BRL: 4.95, 
    JPY: 150, CNY: 7.22, AED: 3.67, AUD: 1.52, CHF: 0.88, 
    INR: 83.1, KRW: 1330 
};

const symbols = { 
    USD: '$', EUR: '€', GBP: '£', CAD: '$', MXN: '$', 
    COP: '$', ARS: '$', CLP: '$', PEN: 'S/', BRL: 'R$', 
    JPY: '¥', CNY: '¥', AED: 'DH ', AUD: '$', CHF: 'CHF ', 
    INR: '₹', KRW: '₩' 
};

const countryTraditions = {
    USD: "🇺🇸 <strong>EE. UU.:</strong> Servicio con garantía de devolución estándar de 30 días y entregas exprés prioritarias.",
    EUR: "🇪🇺 <strong>Europa:</strong> Envoltorio de alta presentación y cumplimiento con la Directiva de Consumo de la UE.",
    GBP: "🇬🇧 <strong>Reino Unido:</strong> Entrega certificada y opciones de envoltorio de regalo clásico británico.",
    CAD: "🇨🇦 <strong>Canadá:</strong> Envíos optimizados para zonas invernales con empaque protector térmico.",
    MXN: "🇲🇽 <strong>México:</strong> Opción de pago a meses sin intereses y entregas seguras garantizadas.",
    COP: "🇨🇴 <strong>Colombia:</strong> Soporte dedicado y confirmación de recepción previa vía WhatsApp.",
    ARS: "🇦🇷 <strong>Argentina:</strong> Facturación simplificada y opciones de envío local coordinado.",
    CLP: "🇨🇱 <strong>Chile:</strong> Cobertura completa de despacho a regiones y seguimiento en tiempo real.",
    PEN: "🇵🇪 <strong>Perú:</strong> Entregas personales aseguradas y atención preferencial para clientes OMNIA.",
    BRL: "🇧🇷 <strong>Brasil:</strong> Opción de parcelamiento en tarjeta y soporte directo en portugués.",
    JPY: "🇯🇵 <strong>Japón (日本):</strong> Presentación Omotenashi con empaque de lujo respetando la etiqueta de regalos nipona.",
    CNY: "🇨🇳 <strong>China (中国):</strong> Preparación especial para entregas durante el Festival de Primavera y eventos de compras.",
    AED: "🇦🇪 <strong>Emiratos Árabes:</strong> Servicio VIP con entrega en mensajería privada y empaquetado de alta gama.",
    AUD: "🇦🇺 <strong>Australia:</strong> Logística neutral en carbono y embalaje 100% reciclable para el cuidado del entorno.",
    CHF: "🇨🇭 <strong>Suiza:</strong> Precisión puntual en los tiempos de entrega y garantía extendida de fabricación.",
    INR: "🇮🇳 <strong>India:</strong> Presentaciones especiales aptas para festividades tradicionales como Diwali y celebraciones.",
    KRW: "🇰🇷 <strong>Corea del Sur (한국):</strong> Envío ultra-rápido en empaque de presentación K-Luxury."
};

const policies = {
    shipping: {
        title: "Política Global de Envíos, Despachos y Logística Internacional",
        content: `
            <h3>1. Cobertura Geográfica y Red Logística Global</h3>
            <p>En OMNIA operamos una red integrada de distribución internacional respaldada por socios estratégicos como DHL Express, FedEx, UPS y operadores postales nacionales de alta eficiencia. Realizamos envíos diarios a más de 180 países y territorios reconocidos internacionalmente, garantizando un manejo prioritario desde nuestros almacenes centrales situados estratégicamente en puntos logísticos clave de América, Europa y Asia.</p>
            <p>Cualquier orden realizada a través de nuestra plataforma se procesa de forma automatizada mediante nuestros centros de cumplimiento de pedidos (Fulfillment Centers). La asignación del depósito de despacho se determina automáticamente según la disponibilidad de inventario y la ubicación geográfica del comprador para optimizar las rutas de transporte y reducir las emisiones de carbono.</p>

            <h3>2. Modalidades, Plazos de Entrega y Estructura de Costos</h3>
            <p>Ofrecemos múltiples esquemas de envío diseñados para adaptarse a la urgencia y requerimientos específicos de cada cliente alrededor del mundo:</p>
            <p>• <strong>Envío Internacional Exprés Prioritario:</strong> Bonificado y gratuito en compras superiores a $150.00 USD (o su equivalente exacto en la moneda local seleccionada). Ofrece un tiempo estimado de entrega de 3 a 5 días hábiles a partir de la confirmación de salida de almacén. Incluye seguro de tránsito de cobertura completa contra pérdidas, daños accidentales o robos en ruta.</p>
            <p>• <strong>Envío Internacional Estándar Certificado:</strong> Orientado a entregas convencionales con un tiempo estimado de tránsito de 7 a 12 días hábiles, sujeto a las inspecciones aduaneras del país de destino.</p>
            <p>• <strong>Logística de Artículos de Colección, Obras de Arte y Ediciones Limitadas:</strong> Para productos categorizados como piezas únicas, obras de arte esculpidas o indumentaria de alta costura, los tiempos de preparación pueden requerir de 48 a 72 horas adicionales. Esto se debe a rigurosos protocolos de empaque térmico, aislamiento contra humedad y sellado de seguridad antes de la entrega al transportista asignado.</p>

            <h3>3. Tiempos de Procesamiento, Auditoría y Verificación de Seguridad</h3>
            <p>Todas las órdenes confirmadas en OMNIA atraviesan una fase inicial de verificación de pago e inspección antifraude que toma habitualmente entre 12 y 24 horas hábiles. Las órdenes recibidas en días sábados, domingos o festivos oficiales en el centro logístico origen se procesarán inmediatamente el siguiente día hábil operativo.</p>
            <p>Es responsabilidad del cliente proporcionar una dirección de entrega exacta y completa, incluyendo número de calle, apartamento, código postal, ciudad y un número telefónico de contacto activo para coordinar la entrega con la mensajería local.</p>

            <h3>4. Aranceles, Impuestos de Importación y Normativas Aduaneras</h3>
            <p>Los precios mostrados en el portal incluyen o excluyen aranceles locales de aduana de acuerdo con las normativas comerciales de cada país. El comprador actúa como el importador oficial del producto y es responsable legal de cualquier impuesto de importación, IVA/TVA local o tasa de despacho de aduana requerida por las autoridades gubernamentales del país de recepción.</p>
            <p>OMNIA adjunta de forma automatizada toda la documentación legal requerida, incluyendo la factura comercial electrónica y la declaración de aduanas, facilitando un proceso de liberación aduanera fluido y libre de contratiempos.</p>

            <h3>5. Rastreo en Tiempo Real, Notificaciones y Reclamaciones</h3>
            <p>Al completarse el despacho de la mercancía, el sistema genera automáticamente un número de guía único (Air Waybill) sincronizado con las plataformas de DHL, FedEx o UPS. Este código se envía al correo electrónico del usuario y se actualiza en su panel personal para el seguimiento en tiempo real.</p>
            <p>En caso de producirse retrasos ajenos a nuestro control (tales como fenómenos meteorológicos adversos, huelgas de transporte o inspecciones aleatorias de aduana), el equipo de atención corporativa de OMNIA asumirá el seguimiento directo frente a la aerolínea o transportista hasta la recepción conforme del pedido.</p>
        `
    },
    returns: {
        title: "Política de Devoluciones, Reembolsos y Garantía de Satisfacción",
        content: `
            <h3>1. Compromiso de Satisfacción Garantizada de 30 Días</h3>
            <p>En OMNIA nos esforzamos por mantener los más altos estándares de calidad, confección y autenticidad en cada una de nuestras piezas. Si por cualquier motivo el comprador no queda absolutamente satisfecho con los artículos recibidos, nuestra Política de Devolución Extendida le otorga un plazo legal de 30 días calendario, contados a partir de la fecha de recepción confirmada por la empresa de mensajería, para solicitar un cambio de producto o el reembolso total de su dinero.</p>

            <h3>2. Criterios y Condiciones Obligatorias para la Aprobación</h3>
            <p>Para admitir la devolución de un producto comercializado en nuestra plataforma, este debe cumplir sin excepción con los siguientes requisitos de inspección:</p>
            <p>• Estar en estado estrictamente nuevo, sin haber sido usado, lavado, alterado ni haber estado expuesto a perfumes, humo o desodorantes.</p>
            <p>• Conservar todas sus etiquetas originales intactas, sellos de autenticidad, certificados de edición limitada y elementos de empaque de lujo (bolsas protectoras contra el polvo, cajas rígidas de marca y accesorios adicionales).</p>
            <p>• No pertenecer a las categorías excluidas por razones sanitarias y de bioseguridad, tales como prendas íntimas, cosméticos con sellos violados, aretes o piezas personalizadas hechas a medida bajo encargo previo.</p>

            <h3>3. Procedimiento Paso a Paso para la Solicitud de Devolución</h3>
            <p>1. Iniciar la solicitud contactando a nuestro equipo de soporte exclusivo a través del correo <strong>soporte@omnia.com</strong>, indicando el número de orden y la razón detallada de la devolución.</p>
            <p>2. Un agente de atención al cliente evaluará la solicitud dentro de un lapso no mayor a 24 horas hábiles y emitirá una Autorización de Devolución de Mercancía (RMA) junto con una etiqueta de envío prepagada o las instrucciones de retiro a domicilio con DHL o FedEx.</p>
            <p>3. El cliente deberá empacar el producto en su caja de protección original para prevenir daños durante el tránsito de retorno hacia nuestro centro de logística inversa.</p>

            <h3>4. Inspección de Control de Calidad y Emisión del Reembolso</h3>
            <p>Una vez que el paquete retorna a nuestro depósito central de procesamiento de devoluciones, el equipo de auditoría técnica realizará una revisión física minuciosa dentro de las 48 horas hábiles siguientes. Aprobada la verificación, el reembolso se procesará según la modalidad elegida:</p>
            <p>• <strong>Reembolso al Método Original de Pago:</strong> El dinero se reintegrará directamente a la tarjeta de crédito/débito, cuenta de PayPal o transferencia utilizada en la compra original. El tiempo de reflejo bancario oscila entre 3 y 7 días hábiles, según las políticas de la institución emisora.</p>
            <p>• <strong>Crédito en Tienda / Tarjeta de Regalo VIP:</strong> El cliente puede optar por recibir un saldo a favor en OMNIA con una bonificación adicional del 10% sobre el valor del producto devuelto para utilizarlo en compras futuras sin fecha de caducidad.</p>

            <h3>5. Cobertura de Costos Logísticos de Retorno</h3>
            <p>Si la devolución obedece a un error imputable a OMNIA (producto con defectos de fábrica, talla equivocada despachada o daños sufridos durante el transporte inicial), la empresa asumirá el 100% de los costos de recolección y logística inversa. En devoluciones voluntarias por preferencia de color o estilo, se aplicará una deducción mínima por gestión de procesamiento que será informada al cliente antes de emitir la etiqueta de retorno.</p>
        `
    },
    privacy: {
        title: "Política de Privacidad, Uso de Cookies y Protección de Datos (GDPR & CCPA Compliant)",
        content: `
            <h3>1. Compromiso Institucional con la Privacidad del Usuario</h3>
            <p>OMNIA Global Fashion & Art Marketplace Inc. asume el compromiso legal y ético de garantizar la privacidad, seguridad y confidencialidad absoluta de los datos personales recopilados de nuestros usuarios. Damos cumplimiento estricto a las regulaciones internacionales más rigurosas en materia de protección de datos, incluyendo el Reglamento General de Protección de Datos de la Unión Europea (GDPR), la Ley de Privacidad del Consumidor de California (CCPA) y los marcos normativos vigentes en América Latina y Asia.</p>

            <h3>2. Información Recopilada y Métodos de Captura</h3>
            <p>Recopilamos únicamente la información mínima y necesaria para asegurar la prestación óptima de nuestros servicios comerciales y logísticos:</p>
            <p>• <strong>Datos de Identificación Personal:</strong> Nombre completo, dirección de correo electrónico, número telefónico de contacto, dirección de facturación y dirección física de entrega proporcionados durante la creación de cuenta o proceso de checkout.</p>
            <p>• <strong>Datos de Navegación Técnica y Uso:</strong> Dirección IP, tipo de navegador, sistema operativo, identificadores de dispositivo, cookies de sesión y patrones de interacción con las páginas de nuestro catálogo para mejorar la usabilidad.</p>

            <h3>3. Procesamiento Seguro de Transacciones Financieras y Cifrado SSL</h3>
            <p>OMNIA adopta estándares de seguridad informática de nivel bancario. Todas las transacciones comerciales ejecutadas en nuestra plataforma están protegidas mediante capas de socket seguro con cifrado SSL/TLS de 256 bits. OMNIA no almacena ni procesa en sus servidores locales los números completos de tarjetas de crédito o débito, códigos CVC/CVV ni claves secretas de los usuarios.</p>
            <p>Los cobros son gestionados de forma externa a través de pasarelas de pago certificadas bajo el nivel PCI-DSS Level 1 (incluyendo PayPal, Citibank e instituciones bancarias asociadas), garantizando que los datos sensibles se transmitan de forma encriptada directamente al emisor de la tarjeta.</p>

            <h3>4. Finalidad del Tratamiento de Datos y Terceros Autorizados</h3>
            <p>Los datos almacenados se utilizan exclusivamente para los siguientes propósitos operativos: procesamiento de pedidos, gestión de despacho con mensajerías asociadas, prevención de fraudes comerciales, soporte al cliente y envio de comunicaciones del Club VIP (previo consentimiento expreso). OMNIA no vende, alquila ni comercializa bajo ninguna circunstancia las bases de datos de sus clientes con agencias publicitarias o terceros no autorizados.</p>

            <h3>5. Ejercicio de Derechos ARCO y Control de Cookies</h3>
            <p>Cualquier usuario registrado tiene el derecho inalienable de ejercer sus derechos de Acceso, Rectificación, Cancelación, Oposición, Limitación y Portabilidad (Derechos ARCO) sobre su información personal. Puede solicitar la eliminación total de su cuenta y datos enviando una comunicación escrita a <strong>soporte@omnia.com</strong>. Asimismo, el usuario puede configurar su navegador en cualquier momento para bloquear o eliminar las cookies de seguimiento sin alterar el funcionamiento básico de la tienda.</p>
        `
    },
    terms: {
        title: "Términos del Servicio, Legales y Condiciones de Contratación",
        content: `
            <h3>1. Aceptación Vinculante de las Condiciones de Uso</h3>
            <p>El acceso, navegación y realización de transacciones dentro del sitio web OMNIA otorga la condición de usuario e implica la aceptación plena, consciente y sin reservas de todas y cada una de las clausulas contempladas en este documento de Términos del Servicio. Si el usuario no se encuentra de acuerdo con las condiciones establecidas, deberá abstenerse de utilizar la plataforma y sus servicios asociados.</p>

            <h3>2. Capacidad Legal del Usuario y Registro de Cuenta</h3>
            <p>Los servicios ofrecidos por OMNIA están dirigidos exclusivamente a personas físicas o jurídicas que posean plena capacidad legal para celebrar contratos vinculantes de conformidad con la legislación aplicable en su país de residencia. La creación de una cuenta de cliente requiere el suministro de información veraz, actualizada y completa. Es responsabilidad exclusiva del usuario resguardar la confidencialidad de sus credenciales de acceso (usuario y contraseña) y de las actividades que se ejecuten desde su perfil.</p>

            <h3>3. Propiedad Intelectual, Marcas y Derechos de Autor</h3>
            <p>Todo el contenido integrado en este sitio web —incluyendo pero no limitándose a: marcas registradas, logotipos, isotipos, nombres comerciales, textos explicativos, fotografias de producto, diseños de indumentaria, animaciones gráficas en Canvas, códigos fuente, hojas de estilo CSS e interfaces de usuario— es propiedad intelectual exclusiva de OMNIA Inc. o de sus diseñadores y licenciantes globales. Queda prohibida la copia, reproducción, distribución, modificación o explotación comercial no autorizada de estos contenidos sin el consentimiento previo por escrito de la empresa.</p>

            <h3>4. Precios, Disponibilidad, Errores Tipográficos y Modificaciones</h3>
            <p>OMNIA realiza esfuerzos continuos para garantizar que la información de precios, descripciones de producto e inventarios sea exacta y actualizada en tiempo real. Sin embargo, en el eventual caso de un error tipográfico involuntario o falla sistémica en la marcación de un precio o inventario, OMNIA se reserva el derecho legal de cancelar la orden afectada, notificando de inmediato al comprador y efectuando el reembolso integro de cualquier importe abonado.</p>
            <p>La empresa se reserva la facultad de modificar en cualquier momento las especificaciones de los productos, precios exhibidos o condiciones comerciales sin necesidad de previo aviso, aplicando los cambios únicamente a transacciones futuras.</p>

            <h3>5. Jurisdicción Aplicable, Resolución de Controversias y Ley Regente</h3>
            <p>Los presentes Términos del Servicio se rigen e interpretan de acuerdo con las leyes del comercio internacional. Cualquier controversia, litigio o reclamación derivada de la interpretación o ejecución de este contrato que no pueda ser resuelta mediante mediación amistosa entre las partes, será sometida a la jurisdicción de los tribunales competentes de la sede corporativa de la empresa o mediante arbitraje comercial internacional.</p>
        `
    },
    legal: {
        title: "Aviso Legal, Transparencia Corporativa e Identificación",
        content: `
            <h3>1. Datos Identificativos y Titularidad de la Empresa</h3>
            <p>En cumplimiento con los deberes de información general y transparencia que rigen el comercio electrónico internacional, se detallan a continuación las credenciales legales del titular y operador oficial del sitio web:</p>
            <p>• <strong>Denominación Social Oficial:</strong> OMNIA Global Fashion & Art Marketplace Inc.</p>
            <p>• <strong>Registro Mercantil y Licencia Comercial:</strong> Licencia Internacional No. 984520-2026-OMN.</p>
            <p>• <strong>Sede de Operaciones Globales:</strong> OMNIA Tower, Financial District, Suite 4200, USA.</p>
            <p>• <strong>Correo Electrónico Corporativo:</strong> soporte@omnia.com</p>
            <p>• <strong>Atención Telefónica Directa:</strong> +1 (800) 555-OMNIA</p>

            <h3>2. Exención de Responsabilidad por Interrupciones Técnicas y Enlaces Externos</h3>
            <p>OMNIA adopta todas las medidas tecnológicas de vanguardia para asegurar el funcionamiento ininterrumpido del sitio web. No obstante, la empresa no se hace responsable por interrupciones temporales del servicio ocasionadas por labores de mantenimiento programado del servidor, fallas de conectividad en los proveedores de servicio de internet del usuario, ciberataques de terceros o situaciones imprevisibles de fuerza mayor.</p>
            <p>Este sitio web puede contener enlaces hipertextuales hacia plataformas externas o herramientas de procesamiento de pago administradas por terceros (como procesadores bancarios u operadores logísticos). OMNIA no ejerce control sobre el contenido, políticas de privacidad o prácticas de dichos sitios web externos y queda exenta de toda responsabilidad derivada del uso de los mismos por parte del usuario.</p>

            <h3>3. Exactitud de Contenidos y Derechos de Propiedad Industrial</h3>
            <p>OMNIA vela por la calidad y veracidad de toda la información difundida en la plataforma. Sin embargo, no garantiza la ausencia total de omisiones imprevistas o erratas en las descripciones técnicas de los artículos. Las marcas comerciales registradas y logos de terceros que aparecen en el portal (tales como Visa, Mastercard, Discover, Amex, PayPal o Citibank) se utilizan exclusivamente con fines de identificación de métodos de pago autorizados y son propiedad de sus respectivos titulares legales.</p>

            <h3>4. Actualizaciones del Aviso Legal y Transparencia</h3>
            <p>OMNIA se reserva el derecho de modificar o actualizar las estipulaciones contenidas en este Aviso Legal para adecuarlas a nuevas exigencias legislativas, jurisprudenciales o decisiones de la dirección corporativa. Se recomienda a los usuarios consultar periódicamente esta sección para conocer las normativas vigentes que regulan el uso de la tienda.</p>
        `
    }
};

const i18n = {
    es: {
        searchPlaceholder: "Buscar moda, arte, accesorios...", cartText: "Carrito", heroSubtitle: "ALTA COSTURA & TENDENCIA 2026",
        heroTitle: "Elegancia Vibrante & Diseño Exclusivo", heroDesc: "Descubre colecciones limitadas creadas por los diseñadores más influyentes del mundo.",
        heroBtn: "Ver Colección Exclusiva", addBtn: "Agregar al Carrito", vipBadge: "MEMBRESÍA VIP",
        newsTitle: "Únete al Club Privado OMNIA", newsDesc: "Obtén un 15% de descuento inmediato y acceso prioritario a lanzamientos y colecciones exclusivas.",
        newsPlaceholder: "Ingresa tu correo electrónico personal...", newsBtn: "Obtener Acceso",
        p1: { name: 'Chaqueta de Cuero Nocturna', desc: 'Chaqueta de cuero italiano seleccionada a mano con acabados metálicos y forro de seda.' },
        p2: { name: 'Zapatillas OMNIA Street Pro', desc: 'Edición limitada con suela de absorción de impacto y materiales sostenibles.' },
        p3: { name: 'Reloj Cronógrafo Minimalista', desc: 'Maquinaria de precisión suiza con cristal de zafiro anti-rayaduras.' },
        p4: { name: 'Escultura Abstracta Cyber', desc: 'Pieza de arte futurista esculpida en resina de alta densidad chapada en oro.' },
        p5: { name: 'Gafas de Sol Titanium', desc: 'Protección UV400 con montura ultra ligera de titanio de grado aeroespacial.' },
        p6: { name: 'Hoodie Oversized OMNIA', desc: 'Algodón pesado 100% orgánico con bordados de alta calidad.' }
    },
    en: {
        searchPlaceholder: "Search fashion, art, accessories...", cartText: "Cart", heroSubtitle: "HIGH FASHION & TRENDS 2026",
        heroTitle: "Vibrant Elegance & Exclusive Design", heroDesc: "Discover limited collections crafted by the world's most influential designers.",
        heroBtn: "View Exclusive Collection", addBtn: "Add to Cart", vipBadge: "VIP MEMBERSHIP",
        newsTitle: "Join the OMNIA Private Club", newsDesc: "Get an instant 15% discount and priority access to releases and exclusive collections.",
        newsPlaceholder: "Enter your personal email...", newsBtn: "Get Access",
        p1: { name: 'Night Leather Jacket', desc: 'Hand-selected Italian leather jacket with metallic accents and silk lining.' },
        p2: { name: 'OMNIA Street Pro Sneakers', desc: 'Limited edition with shock-absorption soles and sustainable materials.' },
        p3: { name: 'Minimalist Chronograph Watch', desc: 'Swiss precision movement with scratch-resistant sapphire crystal.' },
        p4: { name: 'Cyber Abstract Sculpture', desc: 'Futuristic art piece sculpted in high-density gold-plated resin.' },
        p5: { name: 'Titanium Sunglasses', desc: 'UV400 protection with ultra-light aerospace-grade titanium frame.' },
        p6: { name: 'OMNIA Oversized Hoodie', desc: '100% organic heavy cotton with high-quality embroidery.' }
    }
};

let cart = [];
let currentLang = 'es';
let currentCurrency = 'USD';
let selectedProduct = null;

function applyContactConfig() {
    document.getElementById('contactEmail').textContent = siteConfig.contactEmail;
    document.getElementById('contactPhone').textContent = siteConfig.contactPhone;
    document.getElementById('footerEmail').textContent = siteConfig.contactEmail;
    document.getElementById('footerPhone').textContent = siteConfig.contactPhone;
}

function updateCulturalNotice() {
    const noticeBox = document.getElementById('culturalNotice');
    if (noticeBox) {
        noticeBox.innerHTML = countryTraditions[currentCurrency] || countryTraditions['USD'];
    }
}

function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    const langData = i18n[currentLang] || i18n['es'];
    
    grid.innerHTML = items.map(p => {
        const prodLang = langData[p.key] || i18n['es'][p.key] || {};
        const productName = p.titleCustom || prodLang.name || p.key;
        const price = (p.priceUSD * rates[currentCurrency]).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return `
            <div class="card" onclick="openProductModal(${p.id})">
                <img src="${p.image}" alt="${productName}">
                <div class="card-body">
                    <div class="card-cat">${p.category}</div>
                    <div class="card-title">${productName}</div>
                    <div class="card-price">${symbols[currentCurrency]}${price}</div>
                    <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">${langData.addBtn}</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateStaticTranslations() {
    const langData = i18n[currentLang] || i18n['es'];
    document.getElementById('searchInput').placeholder = langData.searchPlaceholder;
    document.querySelector('.cart-btn').innerHTML = `${langData.cartText} <span id="cartCount" class="badge">${cart.length}</span>`;
    document.querySelector('.hero-subtitle').textContent = langData.heroSubtitle;
    document.querySelector('.hero-content h1').textContent = langData.heroTitle;
    document.querySelector('.hero-content p').textContent = langData.heroDesc;
    document.querySelector('.hero-btn').textContent = langData.heroBtn;
    document.querySelector('.vip-badge').textContent = langData.vipBadge;
    document.querySelector('.newsletter-card h2').textContent = langData.newsTitle;
    document.querySelector('.newsletter-card p').textContent = langData.newsDesc;
    document.querySelector('.newsletter-form input').placeholder = langData.newsPlaceholder;
    document.querySelector('.newsletter-form button').textContent = langData.newsBtn;
}

function changeLang() {
    currentLang = document.getElementById('langSelect').value;
    updateStaticTranslations();
    renderProducts(products);
    updateCartUI();
}

function changeCurrency() {
    currentCurrency = document.getElementById('currencySelect').value;
    updateCulturalNotice();
    renderProducts(products);
    updateCartUI();

}

function openProductModal(id) {
    selectedProduct = products.find(p => p.id === id);
    const langData = i18n[currentLang] || i18n['es'];
    const prodLang = langData[selectedProduct.key] || i18n['es'][selectedProduct.key];
    const productName = selectedProduct.titleCustom || prodLang.name || selectedProduct.key;
    const productDescription = selectedProduct.descCustom || prodLang.desc || '';
    const price = (selectedProduct.priceUSD * rates[currentCurrency]).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('modalProductImg').src = selectedProduct.image;
    document.getElementById('modalProductCat').textContent = selectedProduct.category;
    document.getElementById('modalProductTitle').textContent = productName;
    document.getElementById('modalProductDesc').textContent = productDescription;
    document.getElementById('modalProductPrice').textContent = `${symbols[currentCurrency]}${price}`;
    document.getElementById('modalCulturalTip').innerHTML = countryTraditions[currentCurrency] || countryTraditions['USD'];
    document.getElementById('productQty').value = 1;

    document.getElementById('productModal').style.display = 'flex';
    initPayPalButtons();
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function incrementQty() {
    const qtyInput = document.getElementById('productQty');
    let val = parseInt(qtyInput.value) || 1;
    if (val < 100) qtyInput.value = val + 1;
}

function decrementQty() {
    const qtyInput = document.getElementById('productQty');
    let val = parseInt(qtyInput.value) || 1;
    if (val > 1) qtyInput.value = val - 1;
}

function addModalToCart() {
    const qty = parseInt(document.getElementById('productQty').value) || 1;
    for(let i = 0; i < qty; i++) {
        cart.push(selectedProduct);
    }
    updateCartUI();
    closeProductModal();
}

/* PASARELA PAYPAL EXPRESS */
function initPayPalButtons() {
    if (typeof paypal === 'undefined') return;

    const modalContainer = document.getElementById('paypalModalButtonContainer');
    if (modalContainer && selectedProduct) {
        modalContainer.innerHTML = '';
        paypal.Buttons({
            style: { layout: 'horizontal', color: 'gold', shape: 'pill', label: 'pay' },
            createOrder: (data, actions) => {
                const qty = parseInt(document.getElementById('productQty').value) || 1;
                const convertedAmount = (selectedProduct.priceUSD * qty * rates[currentCurrency]).toFixed(2);
                return actions.order.create({
                    purchase_units: [{
                        description: selectedProduct.key,
                        amount: { currency_code: currentCurrency, value: convertedAmount }
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then(details => {
                    alert(`¡Pago completado con éxito por ${details.payer.name.given_name}! Código de orden: ${details.id}`);
                    closeProductModal();
                });
            }
        }).render('#paypalModalButtonContainer');
    }

    const otherPaymentContainer = document.getElementById('paypalOtherPaymentContainer');
    if (otherPaymentContainer) {
        otherPaymentContainer.innerHTML = '';
        if (cart.length > 0) {
            paypal.Buttons({
                style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'checkout' },
                createOrder: (data, actions) => {
                    const totalUSD = cart.reduce((sum, p) => sum + p.priceUSD, 0);
                    const convertedAmount = (totalUSD * rates[currentCurrency]).toFixed(2);
                    return actions.order.create({
                        purchase_units: [{
                            description: "Orden de compra OMNIA Marketplace",
                            amount: { currency_code: currentCurrency, value: convertedAmount }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        alert(`¡Gracias por tu compra, ${details.payer.name.given_name}! Orden confirmada ID: ${details.id}`);
                        cart = [];
                        updateCartUI();
                        closeOtherPaymentsModal();
                    });
                }
            }).render('#paypalOtherPaymentContainer');
        }
    }
}

function openOtherPaymentsModal() {
    document.getElementById('otherPaymentsModal').style.display = 'flex';
    initPayPalButtons();
}

function closeOtherPaymentsModal() {
    document.getElementById('otherPaymentsModal').style.display = 'none';
}

function toggleAccordion(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const isOpen = target.classList.contains("open");

    document.querySelectorAll(".accordion-content").forEach(el => el.classList.remove("open"));

    if (!isOpen) {
        target.classList.add("open");
    }
}

function processCardPayment(e) {
    e.preventDefault();

    const form = document.getElementById("cardPaymentForm");
    if (!form) return;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const status = document.getElementById("cardPaymentStatus");
    if (status) {
        status.textContent = "El formulario está listo. La pasarela de pago segura todavía debe conectarse antes de procesar la transacción.";
        status.className = "card-payment-status pending";
    }
}

function continueToPayment() {
    const country = document.getElementById("shippingCountry");
    const name = document.getElementById("shippingName");
    const address = document.getElementById("shippingAddress");
    const address2 = document.getElementById("shippingAddress2");
    const city = document.getElementById("shippingCity");
    const state = document.getElementById("shippingState");
    const postal = document.getElementById("shippingPostal");
    const phone = document.getElementById("shippingPhone");

    if (!country || !name || !address || !city || !state || !postal || !phone) return;

    const postalOptionalCountries = ["AE", "HK", "MO", "IE", "JM", "ZA"];
    const stateOptionalCountries = ["SG", "HK", "MO", "IE", "LU", "MC", "VA"];

    postal.required = !postalOptionalCountries.includes(country.value);
    state.required = !stateOptionalCountries.includes(country.value);

    const fields = [country, name, address, city, state, postal, phone];

    for (const field of fields) {
        if (field.required && !field.value.trim()) {
            field.focus();
            field.reportValidity();
            return;
        }
    }

    window.omniaShippingAddress = {
        country: country.value,
        name: name.value.trim(),
        address: address.value.trim(),
        address2: address2 ? address2.value.trim() : "",
        city: city.value.trim(),
        state: state.value.trim(),
        postal: postal.value.trim(),
        phone: phone.value.trim()
    };

    const shippingSection = document.querySelector(".shipping-checkout-section");
    if (shippingSection) {
        shippingSection.classList.add("shipping-complete");
    }

    const paymentAccordion = document.querySelector(".payment-accordion");
    if (paymentAccordion) {
        paymentAccordion.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}
function confirmBankTransfer() {
    alert("Las instrucciones de transferencia estarán disponibles cuando se conecte el proveedor de pagos correspondiente.");
}

function confirmCryptoPayment() {
    alert("El pago digital estará disponible cuando se conecte el proveedor de pagos correspondiente.");
}

function openContactModal() {
    document.getElementById('contactModal').style.display = 'flex';
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
}

function sendContactForm(e) {
    e.preventDefault();

    const form = document.getElementById("contactForm");
    const status = document.getElementById("contactStatus");
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmailInput").value.trim();
    const reason = document.getElementById("contactReason").value;
    const order = document.getElementById("contactOrder").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !reason || !message) {
        status.textContent = "Completa los campos obligatorios para continuar.";
        status.className = "contact-status error";
        return;
    }

    status.textContent = "Mensaje preparado correctamente. Próximamente quedará conectado al sistema de soporte de OMNIA.";
    status.className = "contact-status success";

    form.reset();
}

function openPolicy(key) {
    const policy = policies[key];
    if (policy) {
        document.getElementById('policyTitle').textContent = policy.title;
        document.getElementById('policyBody').innerHTML = policy.content;
        document.getElementById('policyModal').style.display = 'flex';
    }
}

function closePolicyModal() {
    document.getElementById('policyModal').style.display = 'none';
}

function filterCategory(cat) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    if (cat === 'Todos') renderProducts(products);
    else renderProducts(products.filter(p => p.category === cat));
}

function filterProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const langData = i18n[currentLang] || i18n['es'];
    const filtered = products.filter(p => {
        const prodLang = langData[p.key] || i18n['es'][p.key] || {};
        const productName = p.titleCustom || prodLang.name || p.key;
        return prodLang.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    });
    renderProducts(filtered);
}

function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCartUI();
}

function updateCartUI() {
    document.getElementById("cartCount").textContent = cart.length;
    const cartItems = document.getElementById("cartItems");
    const langData = i18n[currentLang] || i18n["es"];
    const totalUSD = cart.reduce((sum, p) => sum + p.priceUSD, 0);
    const totalConverted = (totalUSD * rates[currentCurrency]).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="cart-empty">Tu carrito está vacío.</div>`;
    } else {
        cartItems.innerHTML = cart.map((p, index) => {
            const prodLang = langData[p.key] || i18n["es"][p.key];
        const productName = p.titleCustom || prodLang.name || p.key;
            const price = (p.priceUSD * rates[currentCurrency]).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return `
                <div class="cart-item-row">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${prodLang.name}</span>
                        <span class="cart-item-price">${symbols[currentCurrency]}${price}</span>
                    </div>
                    <button type="button" class="cart-remove-btn" onclick="removeFromCart(${index})">Eliminar</button>
                </div>
            `;
        }).join("");
    }

    document.getElementById("cartTotal").textContent = `${symbols[currentCurrency]}${totalConverted}`;
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';

}

window.toggleSidebar = function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!sidebar || !overlay) {
        console.error('OMNIA: no se encontró la barra lateral o su fondo.');
        return;
    }

    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('active', isOpen);
    document.body.classList.toggle('sidebar-is-open', isOpen);
};

function subscribeEmail(e) {
    e.preventDefault();
    alert('¡Bienvenido al Club OMNIA VIP!');
}

function initHeroAnimation() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#c5a059', '#7928ca', '#00f2fe'];
    const lights = Array.from({ length: 25 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        dx: (Math.random() - 0.5) * 1.2,
        dy: (Math.random() - 0.5) * 1.2,
        alpha: Math.random() * 0.7 + 0.3
    }));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lights.forEach(l => {
            l.x += l.dx;
            l.y += l.dy;
            if (l.x < 0 || l.x > canvas.width) l.dx *= -1;
            if (l.y < 0 || l.y > canvas.height) l.dy *= -1;

            ctx.beginPath();
            ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
            ctx.shadowBlur = 15;
            ctx.shadowColor = l.color;
            ctx.fillStyle = l.color;
            ctx.globalAlpha = l.alpha;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    applyContactConfig();
    updateCulturalNotice();
    updateStaticTranslations();
    renderProducts(products);
    initHeroAnimation();
});

/* CONEXIÓN API PRINTIFY & EBAY EN TIEMPO REAL */
const OMNIA_API_BACKEND = "https://omnia-api.macisterodriguez16.workers.dev";

function getPrintifyCategory(item) {
    const text = `${item.title || ""} ${item.description || ""}`.toLowerCase();

    if (
        text.includes("canvas") ||
        text.includes("poster") ||
        text.includes("print") ||
        text.includes("wall art") ||
        text.includes("art print") ||
        text.includes("framed art") ||
        text.includes("framed canvas")
    ) {
        return "Arte impreso";
    }

    if (
        text.includes("sneaker") ||
        text.includes("shoe") ||
        text.includes("sandal") ||
        text.includes("clog") ||
        text.includes("boot") ||
        text.includes("slide")
    ) {
        return "Calzado";
    }

    if (
        text.includes("shirt") ||
        text.includes("hoodie") ||
        text.includes("jacket") ||
        text.includes("pullover") ||
        text.includes("sweatshirt") ||
        text.includes("dress") ||
        text.includes("top") ||
        text.includes("tee") ||
        text.includes("pants") ||
        text.includes("shorts") ||
        text.includes("leggings") ||
        text.includes("swimwear") ||
        text.includes("apparel")
    ) {
        return "Moda";
    }

    return "Accesorios";
}

function createPrintifyProductId(printifyId) {
    let hash = 0;

    for (let i = 0; i < printifyId.length; i++) {
        hash = ((hash << 5) - hash) + printifyId.charCodeAt(i);
        hash |= 0;
    }

    return 100000 + Math.abs(hash);
}

async function getPrintifyProducts() {
    const allProducts = [];
    let page = 1;
    let lastPage = 1;

    while (page <= lastPage) {
        const res = await fetch(`${OMNIA_API_BACKEND}/api/printify/products?page=${page}`);

        if (!res.ok) {
            throw new Error(`Error HTTP Printify: ${res.status}`);
        }

        const json = await res.json();

        if (
            json.status !== "success" ||
            !json.data ||
            !Array.isArray(json.data.data)
        ) {
            throw new Error("Respuesta de Printify no válida.");
        }

        allProducts.push(...json.data.data);

        lastPage = Number(json.data.last_page) || page;
        page++;
    }

    return allProducts;
}

async function syncPrintifyProducts() {
    try {
        const printifyProducts = await getPrintifyProducts();

        console.log(
            "Productos disponibles en Printify:",
            printifyProducts.length
        );

        return printifyProducts;
    } catch (e) {
        console.log("No se pudo sincronizar Printify:", e.message);
        return [];
    }
}

async function sendOrderToPrintify(orderDetails) {
    try {
        const res = await fetch(`${OMNIA_API_BACKEND}/api/printify/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderDetails)
        });

        const data = await res.json();

        console.log(
            "Respuesta de automatización Printify:",
            data
        );

        return data;
    } catch (e) {
        console.error("Error enviando orden:", e);
        return null;
    }
}

async function syncEbayInventory() {
    try {
        const res = await fetch(`${OMNIA_API_BACKEND}/api/ebay/sync`);
        const data = await res.json();

        console.log(
            "Respuesta de sincronización con eBay:",
            data
        );

        return data;
    } catch (e) {
        console.error("Error sincronizando eBay:", e);
        return null;
    }
}

async function loadPrintifyCatalog() {
    try {
        const printifyProducts = await syncPrintifyProducts();

        if (!printifyProducts.length) {
            return;
        }

        const existingPrintifyKeys = new Set(
            products
                .filter(p => p.key && p.key.startsWith("printify_"))
                .map(p => p.key)
        );

        const printifyItems = printifyProducts
            .filter(item => item && item.id)
            .filter(item => !existingPrintifyKeys.has(`printify_${item.id}`))
            .map(item => {
                const firstImage =
                    item.images &&
                    item.images.length > 0 &&
                    item.images[0].src
                        ? item.images[0].src
                        : "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500";

                const enabledVariants = Array.isArray(item.variants)
                    ? item.variants.filter(v => v.enabled !== false)
                    : [];

                const firstVariant =
                    enabledVariants.length > 0
                        ? enabledVariants[0]
                        : item.variants && item.variants.length > 0
                            ? item.variants[0]
                            : null;

                const basePriceUSD =
                    firstVariant && Number.isFinite(Number(firstVariant.price))
                        ? Number(firstVariant.price) / 100
                        : 99.99;

                const cleanDescription = item.description
                    ? item.description
                        .replace(/<[^>]*>?/gm, "")
                        .replace(/\s+/g, " ")
                        .trim()
                    : "";

                return {
                    id: createPrintifyProductId(String(item.id)),
                    key: `printify_${item.id}`,
                    priceUSD: basePriceUSD,
                    category: getPrintifyCategory(item),
                    image: firstImage,
                    titleCustom: item.title || "Producto OMNIA",
                    descCustom: cleanDescription
                        ? cleanDescription.substring(0, 180)
                        : "",
                    printifyId: item.id,
                    printifyShopId: item.shop_id || null,
                    printifyVariants: enabledVariants
                };
            });

        if (printifyItems.length > 0) {
            products.unshift(...printifyItems);
            renderProducts(products);
        }

        console.log(
            "Catálogo OMNIA actualizado:",
            printifyItems.length,
            "productos nuevos."
        );
    } catch (err) {
        console.log(
            "Sincronización Printify no disponible:",
            err.message
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPrintifyCatalog();
    syncEbayInventory();
});
