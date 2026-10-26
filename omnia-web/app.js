const siteConfig = {
    contactEmail: "soporte@omnia.com",
    contactPhone: "+1 (800) 555-OMNIA",
    paypalClientId: "sb"
};

const products = [];

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

    },
    fr: {
        addBtn: "Ajouter au panier",
        p1: { name: "Veste en cuir nocturne", desc: "Veste en cuir italien sélectionné à la main, avec finitions métalliques et doublure en soie." },
        p2: { name: "Baskets OMNIA Street Pro", desc: "Édition limitée avec semelles amortissantes et matériaux durables." },
        p3: { name: "Montre chronographe minimaliste", desc: "Mouvement suisse de précision et verre saphir résistant aux rayures." },
        p4: { name: "Sculpture abstraite Cyber", desc: "Œuvre futuriste sculptée en résine haute densité plaquée or." },
        p5: { name: "Lunettes de soleil en titane", desc: "Protection UV400 et monture ultra-légère en titane de qualité aérospatiale." },
        p6: { name: "Sweat oversize OMNIA", desc: "Coton épais 100 % biologique avec broderies de haute qualité." }
    },
    pt: {
        addBtn: "Adicionar ao carrinho",
        p1: { name: "Jaqueta de couro noturna", desc: "Jaqueta de couro italiano selecionado à mão, com acabamentos metálicos e forro de seda." },
        p2: { name: "Tênis OMNIA Street Pro", desc: "Edição limitada com solado de absorção de impacto e materiais sustentáveis." },
        p3: { name: "Relógio cronógrafo minimalista", desc: "Movimento suíço de precisão com cristal de safira resistente a riscos." },
        p4: { name: "Escultura abstrata Cyber", desc: "Peça de arte futurista esculpida em resina de alta densidade banhada a ouro." },
        p5: { name: "Óculos de sol de titânio", desc: "Proteção UV400 com armação ultraleve de titânio de grau aeroespacial." },
        p6: { name: "Moletom oversized OMNIA", desc: "Algodão pesado 100% orgânico com bordados de alta qualidade." }
    },
    it: {
        addBtn: "Aggiungi al carrello",
        p1: { name: "Giacca in pelle notturna", desc: "Giacca in pelle italiana selezionata a mano, con finiture metalliche e fodera in seta." },
        p2: { name: "Sneakers OMNIA Street Pro", desc: "Edizione limitata con suola ammortizzante e materiali sostenibili." },
        p3: { name: "Orologio cronografo minimalista", desc: "Movimento svizzero di precisione con vetro zaffiro antigraffio." },
        p4: { name: "Scultura astratta Cyber", desc: "Opera futuristica scolpita in resina ad alta densità placcata in oro." },
        p5: { name: "Occhiali da sole in titanio", desc: "Protezione UV400 e montatura ultraleggera in titanio di grado aerospaziale." },
        p6: { name: "Felpa oversize OMNIA", desc: "Cotone pesante 100% biologico con ricami di alta qualità." }
    },
    de: {
        addBtn: "In den Warenkorb",
        p1: { name: "Nächtliche Lederjacke", desc: "Handverlesene italienische Lederjacke mit Metallakzenten und Seidenfutter." },
        p2: { name: "OMNIA Street Pro Sneaker", desc: "Limitierte Edition mit stoßdämpfender Sohle und nachhaltigen Materialien." },
        p3: { name: "Minimalistische Chronographenuhr", desc: "Präzises Schweizer Uhrwerk mit kratzfestem Saphirglas." },
        p4: { name: "Abstrakte Cyber-Skulptur", desc: "Futuristisches Kunstwerk aus hochdichtem, goldbeschichtetem Harz." },
        p5: { name: "Titan-Sonnenbrille", desc: "UV400-Schutz mit ultraleichtem Rahmen aus Titan in Luftfahrtqualität." },
        p6: { name: "OMNIA Oversize-Hoodie", desc: "Schwere, 100 % biologische Baumwolle mit hochwertiger Stickerei." }
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


// OMNIA: traducciones de productos por idioma, guardadas localmente.
const OMNIA_PRINTIFY_TRANSLATIONS_KEY = "omnia_printify_translations_v2";
const omniaPrintifyPending = Object.create(null);
let omniaPrintifyQueue = Promise.resolve();
let omniaPrintifyCache = {};

try {
    omniaPrintifyCache = JSON.parse(
        localStorage.getItem(OMNIA_PRINTIFY_TRANSLATIONS_KEY) || "{}"
    ) || {};
} catch (_) {
    omniaPrintifyCache = {};
}

function getPrintifyEnglishEntry(product) {
    return null;
}

function getProductDisplayName(product, fallback) {
    return fallback;
}

function getProductDisplayDescription(product, fallback) {
    return fallback;
}

function ensurePrintifyEnglishTranslation(product) {
    return Promise.resolve();
}

function refreshOpenProductTranslation() {
    if (!selectedProduct) return;

    const modal = document.getElementById("productModal");
    if (!modal || modal.style.display !== "flex") return;

    const langData = i18n[currentLang] || i18n.es;
    const prodLang = langData[selectedProduct.key] ||
        i18n.es[selectedProduct.key] || {};

    const name = getProductDisplayName(
        selectedProduct,
        selectedProduct.titleCustom || prodLang.name || selectedProduct.key
    );

    const description = getProductDisplayDescription(
        selectedProduct,
        selectedProduct.descCustom || prodLang.desc || ""
    );

    const titleElement = document.getElementById("modalProductTitle");
    const descElement = document.getElementById("modalProductDesc");

    if (titleElement) titleElement.textContent = name;
    if (descElement) descElement.textContent = description;

    void ensurePrintifyEnglishTranslation(selectedProduct);
}

function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    const langData = i18n[currentLang] || i18n['es'];
    
    grid.innerHTML = items.map(p => {
        void ensurePrintifyEnglishTranslation(p);
        const prodLang = langData[p.key] || i18n['es'][p.key] || {};
        const productName = getProductDisplayName(p, p.titleCustom || prodLang.name || p.key);
        const price = (p.priceUSD * rates[currentCurrency]).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return `
            <div class="card" onclick="openProductModal(${p.id})">
                ${p.image ? `<img src="${p.image}" alt="${productName}" loading="lazy">` : ""}
                <div class="card-body">
                    <div class="card-cat">${getProductAudienceCategory(p) || getPrintifyCategory(p) || p.category || "Accesorios"}</div>
                    <div class="card-title">${productName}</div>
                    <div class="card-price">${symbols[currentCurrency]}${price}</div>
                    <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">${langData.addBtn}</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateStaticTranslations() {
    const en = currentLang === "en";
    const t = en ? {
        search: "Search fashion, art, accessories...",
        cart: "Cart",
        menu: "Private Space",
        home: "Home",
        discover: "Discover",
        printedArt: "Printed Art",
        fashion: "Fashion",
        shoes: "Footwear",
        accessories: "Accessories",
        service: "OMNIA Services",
        contact: "Contact & Support",
        shipping: "Shipping & Logistics",
        returns: "Returns & Warranty",
        privacy: "Privacy & Data",
        terms: "Terms of Service",
        legal: "Legal Notice",
        heroSubtitle: "ART · FASHION · STYLE · LIFE",
        heroTitle: "Everything that inspires you,<br>all in one place.",
        heroDesc: "A new global experience where art, fashion and design come together.",
        heroPrimary: "Explore Collection",
        heroSecondary: "Discover OMNIA",
        introEyebrow: "THE OMNIA EXPERIENCE",
        introTitle: "One platform.<br>Infinite possibilities.",
        introDesc: "Explore curated pieces, exclusive collections and new ways to express your style through an experience created for you.",
        catalogEyebrow: "CURATED COLLECTION",
        catalogTitle: "Discover the collection",
        all: "All",
        men: "Men's Clothing",
        women: "Women's Clothing",
        kids: "Children's Clothing",
        menShoes: "Men's Footwear",
        womenShoes: "Women's Footwear",
        prints: "Printed Wall Art",
        newsletterBadge: "OMNIA PRIVATE CLUB",
        newsletterTitle: "Enter the private circle.",
        newsletterDesc: "Receive updates, special collections and early access to new OMNIA pieces.",
        email: "Your email address",
        subscribe: "Request Access",
        explore: "Explore",
        collections: "Collections",
        attention: "Customer Care",
        information: "Information",
        secure: "Secure Shopping",
        international: "International Shipping",
        refunds: "Refunds",
        data: "Data Protection",
        payments: "SECURELY PROCESSED PAYMENTS",
        rights: "All rights reserved.",
        quantity: "Quantity",
        addCart: "Add to Cart",
        checkout: "Secure Checkout",
        protected: "Protected Payment"
    } : {
        search: "Buscar moda, arte, accesorios...",
        cart: "Carrito",
        menu: "Espacio Privado",
        home: "Inicio",
        discover: "Descubrir",
        printedArt: "Arte impreso",
        fashion: "Moda",
        shoes: "Calzado",
        accessories: "Accesorios",
        service: "Servicio OMNIA",
        contact: "Contacto y Soporte",
        shipping: "Envíos y Logística",
        returns: "Devoluciones y Garantía",
        privacy: "Privacidad y Datos",
        terms: "Términos del Servicio",
        legal: "Aviso Legal",
        heroSubtitle: "ARTE · MODA · ESTILO · VIDA",
        heroTitle: "Todo lo que te inspira,<br>en un solo lugar.",
        heroDesc: "Una nueva experiencia global donde el arte, la moda y el diseño se encuentran.",
        heroPrimary: "Explorar colección",
        heroSecondary: "Descubrir OMNIA",
        introEyebrow: "THE OMNIA EXPERIENCE",
        introTitle: "Una plataforma.<br>Infinitas posibilidades.",
        introDesc: "Explora piezas seleccionadas, colecciones exclusivas y nuevas formas de expresar tu estilo desde una experiencia creada para ti.",
        catalogEyebrow: "CURATED COLLECTION",
        catalogTitle: "Descubre la colección",
        all: "Todo",
        men: "Ropa de hombre",
        women: "Ropa de mujer",
        kids: "Ropa de niños",
        menShoes: "Calzado de hombre",
        womenShoes: "Calzado de mujer",
        prints: "Cuadros impresos",
        newsletterBadge: "OMNIA PRIVATE CLUB",
        newsletterTitle: "Entra en el círculo privado.",
        newsletterDesc: "Recibe novedades, colecciones especiales y acceso anticipado a nuevas piezas de OMNIA.",
        email: "Tu correo electrónico",
        subscribe: "Solicitar acceso",
        explore: "Explorar",
        collections: "Colecciones",
        attention: "Atención",
        information: "Información",
        secure: "Compra segura",
        international: "Envíos internacionales",
        refunds: "Reembolsos",
        data: "Protección de datos",
        payments: "PAGOS PROCESADOS DE FORMA SEGURA",
        rights: "Todos los derechos reservados.",
        quantity: "Cantidad",
        addCart: "Añadir al carrito",
        checkout: "Checkout seguro",
        protected: "Pago protegido"
    };


    const localeOverrides = {
        fr: {
            search:"Rechercher mode, art, accessoires...", cart:"Panier", menu:"Espace privé",
            home:"Accueil", discover:"Découvrir", printedArt:"Art imprimé", fashion:"Mode",
            shoes:"Chaussures", accessories:"Accessoires", service:"Services OMNIA",
            contact:"Contact et assistance", shipping:"Expédition et logistique",
            returns:"Retours et garantie", privacy:"Confidentialité et données",
            terms:"Conditions de service", legal:"Mentions légales",
            heroSubtitle:"ART · MODE · STYLE · VIE",
            heroTitle:"Tout ce qui vous inspire,<br>en un seul endroit.",
            heroDesc:"Une nouvelle expérience mondiale où l’art, la mode et le design se rencontrent.",
            heroPrimary:"Explorer la collection", heroSecondary:"Découvrir OMNIA",
            introEyebrow:"L’EXPÉRIENCE OMNIA",
            introTitle:"Une plateforme.<br>Des possibilités infinies.",
            introDesc:"Découvrez des pièces sélectionnées, des collections exclusives et de nouvelles façons d’exprimer votre style.",
            catalogEyebrow:"COLLECTION SÉLECTIONNÉE", catalogTitle:"Découvrez la collection",
            all:"Tout", men:"Vêtements pour hommes", women:"Vêtements pour femmes",
            kids:"Vêtements pour enfants", menShoes:"Chaussures pour hommes",
            womenShoes:"Chaussures pour femmes", prints:"Art imprimé",
            newsletterBadge:"CLUB PRIVÉ OMNIA", newsletterTitle:"Entrez dans le cercle privé.",
            newsletterDesc:"Recevez les nouveautés, les collections spéciales et un accès anticipé.",
            email:"Votre adresse e-mail", subscribe:"Demander l’accès",
            explore:"Explorer", collections:"Collections", attention:"Service client",
            information:"Informations", secure:"Achats sécurisés",
            international:"Livraison internationale", refunds:"Remboursements",
            data:"Protection des données", payments:"PAIEMENTS TRAITÉS EN TOUTE SÉCURITÉ",
            rights:"Tous droits réservés.", quantity:"Quantité",
            addCart:"Ajouter au panier", checkout:"Paiement sécurisé", protected:"Paiement protégé"
        },
        pt: {
            search:"Pesquisar moda, arte, acessórios...", cart:"Carrinho", menu:"Espaço privado",
            home:"Início", discover:"Descobrir", printedArt:"Arte impressa", fashion:"Moda",
            shoes:"Calçados", accessories:"Acessórios", service:"Serviços OMNIA",
            contact:"Contato e suporte", shipping:"Envio e logística",
            returns:"Devoluções e garantia", privacy:"Privacidade e dados",
            terms:"Termos de serviço", legal:"Aviso legal",
            heroSubtitle:"ARTE · MODA · ESTILO · VIDA",
            heroTitle:"Tudo o que inspira você,<br>em um só lugar.",
            heroDesc:"Uma nova experiência global onde arte, moda e design se encontram.",
            heroPrimary:"Explorar coleção", heroSecondary:"Descobrir OMNIA",
            introEyebrow:"A EXPERIÊNCIA OMNIA",
            introTitle:"Uma plataforma.<br>Possibilidades infinitas.",
            introDesc:"Explore peças selecionadas, coleções exclusivas e novas formas de expressar seu estilo.",
            catalogEyebrow:"COLEÇÃO SELECIONADA", catalogTitle:"Descubra a coleção",
            all:"Tudo", men:"Roupas masculinas", women:"Roupas femininas",
            kids:"Roupas infantis", menShoes:"Calçados masculinos",
            womenShoes:"Calçados femininos", prints:"Arte impressa",
            newsletterBadge:"CLUBE PRIVADO OMNIA", newsletterTitle:"Entre no círculo privado.",
            newsletterDesc:"Receba novidades, coleções especiais e acesso antecipado.",
            email:"Seu endereço de e-mail", subscribe:"Solicitar acesso",
            explore:"Explorar", collections:"Coleções", attention:"Atendimento",
            information:"Informações", secure:"Compra segura",
            international:"Envio internacional", refunds:"Reembolsos",
            data:"Proteção de dados", payments:"PAGAMENTOS PROCESSADOS COM SEGURANÇA",
            rights:"Todos os direitos reservados.", quantity:"Quantidade",
            addCart:"Adicionar ao carrinho", checkout:"Finalização segura", protected:"Pagamento protegido"
        },
        it: {
            search:"Cerca moda, arte, accessori...", cart:"Carrello", menu:"Spazio privato",
            home:"Home", discover:"Scopri", printedArt:"Arte stampata", fashion:"Moda",
            shoes:"Calzature", accessories:"Accessori", service:"Servizi OMNIA",
            contact:"Contatti e assistenza", shipping:"Spedizioni e logistica",
            returns:"Resi e garanzia", privacy:"Privacy e dati",
            terms:"Termini del servizio", legal:"Note legali",
            heroSubtitle:"ARTE · MODA · STILE · VITA",
            heroTitle:"Tutto ciò che ti ispira,<br>in un unico luogo.",
            heroDesc:"Una nuova esperienza globale in cui arte, moda e design si incontrano.",
            heroPrimary:"Esplora la collezione", heroSecondary:"Scopri OMNIA",
            introEyebrow:"L’ESPERIENZA OMNIA",
            introTitle:"Una piattaforma.<br>Possibilità infinite.",
            introDesc:"Scopri articoli selezionati, collezioni esclusive e nuovi modi per esprimere il tuo stile.",
            catalogEyebrow:"COLLEZIONE SELEZIONATA", catalogTitle:"Scopri la collezione",
            all:"Tutto", men:"Abbigliamento uomo", women:"Abbigliamento donna",
            kids:"Abbigliamento bambini", menShoes:"Calzature uomo",
            womenShoes:"Calzature donna", prints:"Arte stampata",
            newsletterBadge:"OMNIA PRIVATE CLUB", newsletterTitle:"Entra nel circolo privato.",
            newsletterDesc:"Ricevi novità, collezioni speciali e accesso anticipato.",
            email:"Il tuo indirizzo e-mail", subscribe:"Richiedi accesso",
            explore:"Esplora", collections:"Collezioni", attention:"Assistenza clienti",
            information:"Informazioni", secure:"Acquisti sicuri",
            international:"Spedizioni internazionali", refunds:"Rimborsi",
            data:"Protezione dei dati", payments:"PAGAMENTI ELABORATI IN SICUREZZA",
            rights:"Tutti i diritti riservati.", quantity:"Quantità",
            addCart:"Aggiungi al carrello", checkout:"Pagamento sicuro", protected:"Pagamento protetto"
        },
        de: {
            search:"Mode, Kunst, Accessoires suchen...", cart:"Warenkorb", menu:"Privater Bereich",
            home:"Startseite", discover:"Entdecken", printedArt:"Druckkunst", fashion:"Mode",
            shoes:"Schuhe", accessories:"Accessoires", service:"OMNIA Services",
            contact:"Kontakt und Support", shipping:"Versand und Logistik",
            returns:"Rückgabe und Garantie", privacy:"Datenschutz",
            terms:"Nutzungsbedingungen", legal:"Impressum",
            heroSubtitle:"KUNST · MODE · STIL · LEBEN",
            heroTitle:"Alles, was dich inspiriert,<br>an einem Ort.",
            heroDesc:"Ein neues globales Erlebnis, in dem Kunst, Mode und Design zusammenkommen.",
            heroPrimary:"Kollektion entdecken", heroSecondary:"OMNIA entdecken",
            introEyebrow:"DAS OMNIA ERLEBNIS",
            introTitle:"Eine Plattform.<br>Unendliche Möglichkeiten.",
            introDesc:"Entdecke ausgewählte Produkte, exklusive Kollektionen und neue Möglichkeiten, deinen Stil auszudrücken.",
            catalogEyebrow:"KURATIERTE KOLLEKTION", catalogTitle:"Kollektion entdecken",
            all:"Alle", men:"Herrenbekleidung", women:"Damenbekleidung",
            kids:"Kinderbekleidung", menShoes:"Herrenschuhe",
            womenShoes:"Damenschuhe", prints:"Druckkunst",
            newsletterBadge:"OMNIA PRIVATE CLUB", newsletterTitle:"Werde Teil des privaten Kreises.",
            newsletterDesc:"Erhalte Neuigkeiten, besondere Kollektionen und frühzeitigen Zugang.",
            email:"Deine E-Mail-Adresse", subscribe:"Zugang anfordern",
            explore:"Entdecken", collections:"Kollektionen", attention:"Kundenservice",
            information:"Informationen", secure:"Sicher einkaufen",
            international:"Internationaler Versand", refunds:"Rückerstattungen",
            data:"Datenschutz", payments:"SICHER ABGEWICKELTE ZAHLUNGEN",
            rights:"Alle Rechte vorbehalten.", quantity:"Menge",
            addCart:"In den Warenkorb", checkout:"Sicher bezahlen", protected:"Geschützte Zahlung"
        }
    };
    Object.assign(t, localeOverrides[currentLang] || {});

    document.documentElement.lang = currentLang;

    const setText = (selector, value) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = value;
    };
    const setHTML = (selector, value) => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = value;
    };

    const search = document.getElementById("searchInput");
    if (search) search.placeholder = t.search;

    const cartButton = document.querySelector(".cart-btn");
    const existingCount = document.getElementById("cartCount");
    const cartCountText = existingCount ? existingCount.textContent : "0";
    if (cartButton) cartButton.innerHTML = `${t.cart} <span id="cartCount" class="badge">${cartCountText}</span>`;

    setText(".sidebar-header h3", t.menu);
    setText(".sidebar-links li:nth-child(1) a", t.home);
    setText(".sidebar-links li:nth-child(2) a", t.discover);
    setText(".sidebar-links li:nth-child(3) a", t.printedArt);
    setText(".sidebar-links li:nth-child(4) a", t.fashion);
    setText(".sidebar-links li:nth-child(5) a", t.shoes);
    setText(".sidebar-links li:nth-child(6) a", t.accessories);
    setText(".sidebar-title", t.service);

    const sideLinks = document.querySelectorAll(".sidebar-links li a");
    const sideText = [t.home, t.discover, t.printedArt, t.fashion, t.shoes, t.accessories, t.contact, t.shipping, t.returns, t.privacy, t.terms, t.legal];
    sideLinks.forEach((el, i) => {
        if (sideText[i]) el.textContent = sideText[i];
    });

    setText(".hero-subtitle", t.heroSubtitle);
    setHTML(".hero-content h1", t.heroTitle);
    setText(".hero-content p", t.heroDesc);
    setText(".hero-btn", t.heroPrimary);
    setText(".hero-secondary-btn", t.heroSecondary);
    setText(".brand-intro .section-eyebrow", t.introEyebrow);
    setHTML(".brand-intro h2", t.introTitle);
    setText(".brand-intro p", t.introDesc);
    setText(".catalog-heading .section-eyebrow", t.catalogEyebrow);
    setText(".catalog-heading h2", t.catalogTitle);

    const categories = {
        "Todo": t.all,
        "Ropa de hombre": t.men,
        "Ropa de mujer": t.women,
        "Ropa de niños": t.kids,
        "Calzado de hombre": t.menShoes,
        "Calzado de mujer": t.womenShoes,
        "Accesorios": t.accessories,
        "Cuadros impresos": t.prints
    };
    document.querySelectorAll(".cat-btn").forEach(el => {
        const key = el.getAttribute("data-category");
        if (categories[key]) el.textContent = categories[key];
    });

    setText(".newsletter-card .vip-badge", t.newsletterBadge);
    setText(".newsletter-card h2", t.newsletterTitle);
    setText(".newsletter-card p", t.newsletterDesc);
    const email = document.querySelector(".newsletter-form input");
    if (email) email.placeholder = t.email;
    setText(".newsletter-form button", t.subscribe);

    const footerHeadings = document.querySelectorAll(".footer-col h4");
    [t.explore, t.attention, t.information].forEach((value, i) => {
        if (footerHeadings[i]) footerHeadings[i].textContent = value;
    });
    const footerLinks = document.querySelectorAll(".footer-col a");
    const footerText = [t.home, t.collections, t.printedArt, t.fashion, t.shoes, t.international, t.refunds, t.data, t.terms, "Control Center"];
    footerLinks.forEach((el, i) => {
        if (footerText[i]) el.textContent = footerText[i];
    });
    setText(".footer-secure", "🔒 " + t.secure);
    setText(".footer-payment-row > span", t.payments);
    const footerBottom = document.querySelector(".footer-bottom p");
    if (footerBottom) footerBottom.textContent = "© 2026 OMNIA Global. " + t.rights;

    const qtyLabel = document.querySelector(".qty-selector label");
    if (qtyLabel) qtyLabel.textContent = t.quantity;
    const addLarge = document.querySelector(".dark-add-btn");
    if (addLarge) addLarge.textContent = t.addCart;
    setText(".express-title", t.checkout);
    const protectedPayment = document.querySelector(".secure-payment-note strong");
    if (protectedPayment) protectedPayment.textContent = t.protected;

}

function changeLang() {
    const selector = document.getElementById("langSelect");
    const supportedLanguages = ["es", "en", "fr", "pt", "it", "de"];
    currentLang = selector && supportedLanguages.includes(selector.value) ? selector.value : "es";
    updateStaticTranslations();
    renderProducts(products);
    updateCartUI();
    refreshOpenProductTranslation();
}

function changeCurrency() {
    currentCurrency = document.getElementById('currencySelect').value;
    updateCulturalNotice();
    renderProducts(products);
    updateCartUI();

}

let currentProductImages = [];
let currentProductZoomAlt = "";
let currentProductImageIndex = 0;

function renderProductGallery(images) {
    currentProductImages = Array.isArray(images)
        ? [...new Set(images.filter(src => typeof src === "string" && src.trim()))]
        : [];

    currentProductImageIndex = 0;

    const mainImage = document.getElementById("modalProductImg");
    const thumbnails = document.getElementById("modalProductThumbnails");
    const previousButton = document.getElementById("galleryPrev");
    const nextButton = document.getElementById("galleryNext");

    if (!mainImage || !thumbnails) return;

    if (currentProductImages.length === 0) {
        mainImage.removeAttribute("src");
        mainImage.alt = "Imagen no disponible";
        thumbnails.innerHTML = "";
        if (previousButton) previousButton.hidden = true;
        if (nextButton) nextButton.hidden = true;
        return;
    }

    mainImage.src = currentProductImages[0];
    mainImage.alt = selectedProduct?.titleCustom || "Producto OMNIA";

    thumbnails.innerHTML = currentProductImages.map((src, index) => `
        <button
            type="button"
            class="product-thumbnail${index === 0 ? " active" : ""}"
            onclick="selectProductImage(${index})"
            aria-label="Ver imagen ${index + 1}"
            aria-pressed="${index === 0}"
        >
            <img src="${src}" alt="" loading="lazy">
        </button>
    `).join("");

    const showNavigation = currentProductImages.length > 1;

    if (previousButton) previousButton.hidden = !showNavigation;
    if (nextButton) nextButton.hidden = !showNavigation;
    initializeProductZoom();
}

function selectProductImage(index) {
    if (index < 0 || index >= currentProductImages.length) return;

    currentProductImageIndex = index;

    const mainImage = document.getElementById("modalProductImg");
    if (mainImage) {
        mainImage.src = currentProductImages[index];
    }

    document.querySelectorAll("#modalProductThumbnails .product-thumbnail")
        .forEach((button, buttonIndex) => {
            const active = buttonIndex === index;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
}

function changeProductImage(direction) {
    if (currentProductImages.length < 2) return;

    const total = currentProductImages.length;

    selectProductImage(
        (currentProductImageIndex + direction + total) % total
    );
}

/* =========================================
   OMNIA — Zoom interactivo de productos
   ========================================= */

let productZoomLevel = 1;
let productZoomPointerStart = null;
let productZoomPanX = 0;
let productZoomPanY = 0;
let productZoomPointers = new Map();
let productZoomGesture = null;



function openProductZoom(images, altText) {
    if (Array.isArray(images) && images.length) {
        currentProductImages = images.filter(Boolean);
        currentProductImageIndex = 0;
    }

    if (!currentProductImages.length) return;

    const modal = document.getElementById("productZoomModal");
    const image = document.getElementById("productZoomImage");
    if (!modal || !image) return;

    productZoomLevel = 1;
    productZoomPanX = 0;
    productZoomPanY = 0;
    currentProductZoomAlt =
        altText || selectedProduct?.titleCustom ||
        "Imagen ampliada del producto";

    image.src = currentProductImages[currentProductImageIndex] || "";
    applyProductZoomTransform();
    image.alt = currentProductZoomAlt;

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    updateProductZoomControls();
}

function closeProductZoom() {
    const modal = document.getElementById("productZoomModal");
    if (!modal) return;

    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    productZoomLevel = 1;
    productZoomPanX = 0;
    productZoomPanY = 0;
    productZoomPointers.clear();
    productZoomGesture = null;
    productZoomPointerStart = null;

    const image = document.getElementById("productZoomImage");
    if (image) {
        image.style.transform = "scale(1)";
    }
}

function updateProductZoomControls() {
    const resetButton = document.getElementById("productZoomReset");
    if (resetButton) {
        resetButton.textContent = `${Math.round(productZoomLevel * 100)}%`;
    }

    const previous = document.getElementById("productZoomPrev");
    const next = document.getElementById("productZoomNext");
    const multipleImages = currentProductImages.length > 1;

    if (previous) previous.hidden = !multipleImages;
    if (next) next.hidden = !multipleImages;
}


function applyProductZoomTransform() {
    const image = document.getElementById("productZoomImage");
    const viewport = document.getElementById("productZoomViewport");
    if (!image || !viewport) return;

    if (productZoomLevel <= 1) {
        productZoomPanX = 0;
        productZoomPanY = 0;
    } else {
        const maxX = Math.max(0,
            (image.offsetWidth * productZoomLevel - viewport.clientWidth) / 2);
        const maxY = Math.max(0,
            (image.offsetHeight * productZoomLevel - viewport.clientHeight) / 2);
        productZoomPanX = Math.max(-maxX, Math.min(maxX, productZoomPanX));
        productZoomPanY = Math.max(-maxY, Math.min(maxY, productZoomPanY));
    }

    image.style.transform =
        `translate3d(${productZoomPanX}px, ${productZoomPanY}px, 0) scale(${productZoomLevel})`;
}

function setProductZoom(level) {
    productZoomLevel = Math.max(1, Math.min(4, level));
    applyProductZoomTransform();
    updateProductZoomControls();
}

function changeProductZoomImage(direction) {
    if (currentProductImages.length < 2) return;

    const total = currentProductImages.length;

    currentProductImageIndex =
        (currentProductImageIndex + direction + total) % total;

    selectProductImage(currentProductImageIndex);

    const image = document.getElementById("productZoomImage");
    if (image) {
        image.src = currentProductImages[currentProductImageIndex];
        image.alt = currentProductZoomAlt || selectedProduct?.titleCustom || "Imagen ampliada del producto";
    }

    setProductZoom(1);
}

function initializeProductZoom() {
    const mainImage = document.getElementById("modalProductImg");
    const modal = document.getElementById("productZoomModal");

    if (!mainImage || !modal || modal.dataset.initialized === "true") return;

    modal.dataset.initialized = "true";

    mainImage.style.cursor = "zoom-in";
    mainImage.addEventListener("click", openProductZoom);

    document.getElementById("productZoomClose")
        ?.addEventListener("click", closeProductZoom);

    document.getElementById("productZoomIn")
        ?.addEventListener("click", () => {
            setProductZoom(productZoomLevel + 0.5);
        });

    document.getElementById("productZoomOut")
        ?.addEventListener("click", () => {
            setProductZoom(productZoomLevel - 0.5);
        });

    document.getElementById("productZoomReset")
        ?.addEventListener("click", () => {
            setProductZoom(1);
        });

    document.getElementById("productZoomPrev")
        ?.addEventListener("click", () => {
            changeProductZoomImage(-1);
        });

    document.getElementById("productZoomNext")
        ?.addEventListener("click", () => {
            changeProductZoomImage(1);
        });

    modal.addEventListener("click", event => {
        if (event.target === modal) closeProductZoom();
    });

    document.addEventListener("keydown", event => {
        if (modal.hidden) return;

        if (event.key === "Escape") closeProductZoom();
        if (event.key === "ArrowLeft") changeProductZoomImage(-1);
        if (event.key === "ArrowRight") changeProductZoomImage(1);
        if (event.key === "+" || event.key === "=") {
            setProductZoom(productZoomLevel + 0.5);
        }
        if (event.key === "-") {
            setProductZoom(productZoomLevel - 0.5);
        }
    });


    const viewport = document.getElementById("productZoomViewport");

    viewport?.addEventListener("pointerdown", event => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        event.preventDefault();
        viewport.setPointerCapture?.(event.pointerId);
        productZoomPointers.set(event.pointerId, {
            x: event.clientX, y: event.clientY
        });

        const points = Array.from(productZoomPointers.values());
        if (points.length >= 2) {
            const a = points[0], b = points[1];
            productZoomGesture = {
                type: "pinch",
                distance: Math.hypot(b.x - a.x, b.y - a.y) || 1,
                zoom: productZoomLevel,
                panX: productZoomPanX, panY: productZoomPanY,
                midX: (a.x + b.x) / 2, midY: (a.y + b.y) / 2
            };
        } else {
            productZoomGesture = {
                type: "pan",
                startX: event.clientX, startY: event.clientY,
                panX: productZoomPanX, panY: productZoomPanY,
                zoom: productZoomLevel
            };
        }
    });

    viewport?.addEventListener("pointermove", event => {
        if (!productZoomPointers.has(event.pointerId)) return;
        event.preventDefault();
        productZoomPointers.set(event.pointerId, {
            x: event.clientX, y: event.clientY
        });

        const points = Array.from(productZoomPointers.values());
        if (points.length >= 2 && productZoomGesture?.type === "pinch") {
            const a = points[0], b = points[1];
            const distance = Math.hypot(b.x - a.x, b.y - a.y) || 1;
            const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
            productZoomLevel = Math.max(1, Math.min(4,
                productZoomGesture.zoom * distance / productZoomGesture.distance));
            productZoomPanX = productZoomGesture.panX + midX - productZoomGesture.midX;
            productZoomPanY = productZoomGesture.panY + midY - productZoomGesture.midY;
            applyProductZoomTransform();
            updateProductZoomControls();
        } else if (points.length === 1 && productZoomGesture?.type === "pan"
                   && productZoomGesture.zoom > 1) {
            productZoomPanX = productZoomGesture.panX + event.clientX - productZoomGesture.startX;
            productZoomPanY = productZoomGesture.panY + event.clientY - productZoomGesture.startY;
            applyProductZoomTransform();
        }
    });

    function finishProductZoomPointer(event) {
        const gesture = productZoomGesture;
        const startX = gesture?.startX, startY = gesture?.startY;
        productZoomPointers.delete(event.pointerId);
        productZoomGesture = null;

        if (gesture?.type === "pan" && gesture.zoom <= 1 &&
            Number.isFinite(startX) &&
            Math.abs(event.clientX - startX) > 60 &&
            Math.abs(event.clientX - startX) > Math.abs(event.clientY - startY)) {
            changeProductZoomImage(event.clientX < startX ? 1 : -1);
        }

        const remaining = Array.from(productZoomPointers.values());
        if (remaining.length === 1) {
            const point = remaining[0];
            productZoomGesture = {
                type: "pan", startX: point.x, startY: point.y,
                panX: productZoomPanX, panY: productZoomPanY,
                zoom: productZoomLevel
            };
        } else if (remaining.length >= 2) {
            const a = remaining[0], b = remaining[1];
            productZoomGesture = {
                type: "pinch",
                distance: Math.hypot(b.x - a.x, b.y - a.y) || 1,
                zoom: productZoomLevel,
                panX: productZoomPanX, panY: productZoomPanY,
                midX: (a.x + b.x) / 2, midY: (a.y + b.y) / 2
            };
        }
    }

    viewport?.addEventListener("pointerup", finishProductZoomPointer);
    viewport?.addEventListener("pointercancel", finishProductZoomPointer);
    mainImage.addEventListener("error", () => {
        if (!modal.hidden) closeProductZoom();
    });
                }


function getPrintifyVariantOptions(product) {
    const definitions = Array.isArray(product?.printifyOptions)
        ? product.printifyOptions : [];
    const variants = Array.isArray(product?.printifyVariants)
        ? product.printifyVariants : [];

    const candidatesOf = value => {
        if (value === undefined || value === null) return [];
        if (typeof value !== "object") return [String(value)];
        return [
            value.id, value.value, value.title,
            value.label, value.name
        ].filter(v => v !== undefined && v !== null).map(String);
    };

    const availableValues = new Set();
    variants.forEach(variant => {
        const options = Array.isArray(variant.options) ? variant.options : [];
        options.forEach(value =>
            candidatesOf(value).forEach(candidate =>
                availableValues.add(candidate)
            )
        );
        [1, 2, 3].forEach(index =>
            candidatesOf(variant[`option${index}`]).forEach(candidate =>
                availableValues.add(candidate)
            )
        );
    });

    return definitions.map((definition, index) => {
        const values = Array.isArray(definition.values)
            ? definition.values
            : Array.isArray(definition.valores)
                ? definition.valores : [];

        const normalizedValues = values.map(value => {
            if (value && typeof value === "object") {
                return {
                    id: String(value.id ?? value.value ?? value.title ?? ""),
                    label: String(
                        value.title ?? value.name ?? value.label ??
                        value.value ?? value.id ?? ""
                    )
                };
            }
            return { id: String(value), label: String(value) };
        }).filter(value => value.id && value.label);

        const filteredValues = normalizedValues.filter(value =>
            availableValues.has(value.id) ||
            availableValues.has(value.label)
        );

        return {
            index,
            name: definition.title || definition.name ||
                definition.título || definition.nombre ||
                `Opción ${index + 1}`,
            values: availableValues.size ? filteredValues : normalizedValues
        };
    }).filter(option => option.values.length > 0);
}



function renderProductVariants(product) {
    const container = document.getElementById("modalProductVariants");
    if (!container) return;

    const variants = Array.isArray(product?.printifyVariants)
        ? product.printifyVariants : [];
    const definitions = getPrintifyVariantOptions(product);
    selectedPrintifyVariant =
        variants.find(v => v.is_default === true) || variants[0] || null;

    if (!definitions.length || !selectedPrintifyVariant) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = definitions.map(definition => `
        <label class="variant-field">
            <span>${definition.name}</span>
            <select class="variant-select"
                data-option-index="${definition.index}"
                aria-label="${definition.name}">
                ${definition.values.map(value =>
                    `<option value="${value.id}">${value.label}</option>`
                ).join("")}
            </select>
        </label>
    `).join("");

    const candidatesOf = value => {
        if (value === undefined || value === null) return [];
        if (typeof value !== "object") return [String(value)];
        return [
            value.id, value.value, value.title,
            value.label, value.name
        ].filter(v => v !== undefined && v !== null).map(String);
    };

    const initialValues = [
        ...(Array.isArray(selectedPrintifyVariant.options)
            ? selectedPrintifyVariant.options : []),
        selectedPrintifyVariant.option1,
        selectedPrintifyVariant.option2,
        selectedPrintifyVariant.option3
    ].flatMap(candidatesOf);

    container.querySelectorAll(".variant-select").forEach(select => {
        const index = Number(select.dataset.optionIndex || 0);
        const definition = definitions.find(d => d.index === index);
        const match = definition?.values.find(value =>
            initialValues.includes(String(value.id)) ||
            initialValues.includes(String(value.label))
        );
        if (match) select.value = match.id;
        select.addEventListener("change", handlePrintifyVariantChange);
    });

    handlePrintifyVariantChange();
}



function handlePrintifyVariantChange() {
    if (!selectedProduct) return;

    const variants = Array.isArray(selectedProduct.printifyVariants)
        ? selectedProduct.printifyVariants : [];
    const definitions = getPrintifyVariantOptions(selectedProduct);
    const selects = Array.from(
        document.querySelectorAll("#modalProductVariants .variant-select")
    );

    const candidatesOf = value => {
        if (value === undefined || value === null) return [];
        if (typeof value !== "object") return [String(value)];
        return [
            value.id, value.value, value.title,
            value.label, value.name
        ].filter(v => v !== undefined && v !== null).map(String);
    };

    const chosenValues = selects.map(select => {
        const index = Number(select.dataset.optionIndex || 0);
        const definition = definitions.find(d => d.index === index);
        const chosen = definition?.values.find(
            value => String(value.id) === String(select.value)
        );
        return chosen
            ? [String(chosen.id), String(chosen.label)]
            : [String(select.value)];
    });

    const match = variants.find(variant => {
        if (!selects.length) return false;

        const rawOptions = Array.isArray(variant.options)
            ? variant.options : [];
        const variantValues = [
            ...rawOptions,
            variant.option1, variant.option2, variant.option3
        ].flatMap(candidatesOf);

        return chosenValues.every(accepted =>
            accepted.some(value => variantValues.includes(value))
        );
    });

    if (!match) {
        selectedPrintifyVariant = null;
        const price = document.getElementById("modalProductPrice");
        if (price) price.textContent = "Combinación no disponible";
        return;
    }

    updateSelectedPrintifyVariant(match);
}


function getPrintifyImagesForVariant(product, variant) {
    const allImages = Array.isArray(product?.images)
        ? product.images.filter(src => typeof src === "string" && src.trim())
        : [];
    const records = Array.isArray(product?.printifyImageVariants)
        ? product.printifyImageVariants
        : [];
    if (!variant || !records.length) return allImages;

    const variantId = String(variant.id ?? "");
    const matchingImages = records
        .filter(image =>
            Array.isArray(image.variant_ids) &&
            image.variant_ids.some(id => String(id) === variantId)
        )
        .map(image => image.src)
        .filter(src => typeof src === "string" && src.trim());

    return matchingImages.length
        ? [...new Set(matchingImages)]
        : allImages;
}

function updateProductGalleryForVariant(variant) {
    if (!selectedProduct) return;
    const images = getPrintifyImagesForVariant(selectedProduct, variant);
    if (images.length) renderProductGallery(images);
}

function updateSelectedPrintifyVariant(variant) {
    if (!variant || !selectedProduct) return;

    selectedPrintifyVariant = variant;
    updateProductGalleryForVariant(variant);

    const priceElement = document.getElementById("modalProductPrice");
    const priceUSD = Number.isFinite(Number(variant.priceUSD))
        ? Number(variant.priceUSD)
        : Number(variant.price) / 100;

    if (!Number.isFinite(priceUSD) || priceUSD <= 0) {
        if (priceElement) priceElement.textContent = "Precio no disponible";
        return;
    }

    const rate = Number(rates[currentCurrency]);
    const converted = priceUSD * (Number.isFinite(rate) ? rate : 1);
    const formatted = converted.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    if (priceElement) {
        priceElement.textContent = `${symbols[currentCurrency]}${formatted}`;
    }
}

function openProductModal(id) {
    selectedProduct = products.find(p => p.id === id);

    if (!selectedProduct) {
        console.warn("Producto OMNIA no encontrado:", id);
        return;
    }

    const langData = i18n[currentLang] || i18n["es"];
    const prodLang = langData[selectedProduct.key] ||
        (i18n["es"] && i18n["es"][selectedProduct.key]) || {};

    const productName = getProductDisplayName(
        selectedProduct,
        selectedProduct.titleCustom || prodLang.name || selectedProduct.key
    );

    const productDescription = getProductDisplayDescription(
        selectedProduct,
        selectedProduct.descCustom || prodLang.desc || ""
    );

    const price = (
        selectedProduct.priceUSD * rates[currentCurrency]
    ).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    renderProductGallery(
        Array.isArray(selectedProduct.images) &&
        selectedProduct.images.length
            ? selectedProduct.images
            : selectedProduct.image
                ? [selectedProduct.image]
                : []
    );

    document.getElementById("modalProductCat").textContent =
        selectedProduct.category || "";

    document.getElementById("modalProductTitle").textContent =
        productName;

    document.getElementById("modalProductDesc").textContent =
        productDescription;

    document.getElementById("modalProductPrice").textContent =
        `${symbols[currentCurrency]}${price}`;

    renderProductVariants(selectedProduct);

    document.getElementById("modalCulturalTip").innerHTML =
        countryTraditions[currentCurrency] ||
        countryTraditions["USD"];

    document.getElementById("productQty").value = 1;
    document.getElementById("productModal").style.display = "flex";

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
    if (!selectedProduct) return;

    const variants = Array.isArray(selectedProduct.printifyVariants)
        ? selectedProduct.printifyVariants
        : [];

    let productToAdd = { ...selectedProduct };

    if (variants.length > 0) {
        if (
            !selectedPrintifyVariant ||
            !variants.some(v => v.id === selectedPrintifyVariant.id)
        ) {
            alert("Selecciona una combinación de opciones disponible antes de continuar.");
            return;
        }

        const variantPrice = Number(selectedPrintifyVariant.priceUSD);

        if (!Number.isFinite(variantPrice) || variantPrice <= 0) {
            alert("El precio de esta variante no está disponible.");
            return;
        }

        const variantImages = getPrintifyImagesForVariant(
            selectedProduct, selectedPrintifyVariant
        );

        productToAdd = {
            ...selectedProduct,
            image: variantImages[0] || selectedProduct.image || "",
            images: variantImages.length ? variantImages : selectedProduct.images,
            priceUSD: variantPrice,
            selectedVariant: { ...selectedPrintifyVariant },
            cartVariantTitle: selectedPrintifyVariant.title || ""
        };
    }

    const qty = Math.max(
        1,
        parseInt(document.getElementById("productQty").value, 10) || 1
    );

    for (let i = 0; i < qty; i++) {
        cart.push({ ...productToAdd });
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
                const unitPrice = selectedProduct.printifyVariants?.length && selectedPrintifyVariant
                    ? Number(selectedPrintifyVariant.priceUSD)
                    : Number(selectedProduct.priceUSD);
                if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
                    throw new Error("El precio de la variante seleccionada no es válido.");
                }
                const convertedAmount = (unitPrice * qty * rates[currentCurrency]).toFixed(2);
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

function initCartPayPalButton() {
    const container = document.getElementById("paypalCartButtonContainer");
    if (!container || typeof paypal === "undefined") return;

    container.innerHTML = "";
    if (!cart.length) return;

    paypal.Buttons({
        style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "checkout"
        },
        createOrder: (data, actions) => {
            const totalUSD = cart.reduce(
                (sum, item) => sum + (Number(item.priceUSD) || 0), 0
            );

            if (!Number.isFinite(totalUSD) || totalUSD <= 0) {
                throw new Error("El total del carrito no es válido.");
            }

            return actions.order.create({
                purchase_units: [{
                    description: "Compra en OMNIA Marketplace",
                    amount: {
                        currency_code: "USD",
                        value: totalUSD.toFixed(2)
                    }
                }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
                cart = [];
                updateCartUI();

                const modal = document.getElementById("cartModal");
                if (modal) modal.style.display = "none";

                const payer = details.payer?.name?.given_name || "cliente";
                alert(
                    `¡Gracias por tu compra, ${payer}! ` +
                    `Orden: ${details.id}`
                );
            });
        },
        onError: error => {
            console.error("OMNIA PayPal:", error);
            alert("No se pudo completar el pago con PayPal. Inténtalo de nuevo.");
        }
    }).render("#paypalCartButtonContainer");
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


function getProductAudienceCategory(product) {
    const tags = Array.isArray(product.tags)
        ? product.tags
        : Array.isArray(product.etiquetas)
            ? product.etiquetas
            : [];

    const text = [
        product.titleCustom || "",
        product.title || "",
        product.name || "",
        product.description || "",
        product.descCustom || "",
        product.key || "",
        product.audienceCategory || "",
        ...tags
    ].join(" ").toLowerCase()
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "");

    const category = String(product.category || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const all = category + " " + text;

    const footwear =
        /calzado|sandalia|sandal|shoe|sneaker|trainer|boot|clog|slipper|loafer|heel|chancla|flip flop/.test(all);

    const kids =
        /\b(kids?|children|toddler|youth|infant|baby|ninos?|ninas?|infantil|bebe|bebes)\b/.test(text);

    const women =
        /\b(womens?|ladies|female|mujer|mujeres|femenina|femenino)\b/.test(text);

    const men =
        /\b(mens?|male|hombre|hombres|masculina|masculino)\b/.test(text);

    if (footwear) {
        if (kids) return "";
        if (women) return "Calzado de mujer";
        if (men) return "Calzado de hombre";
        return "";
    }

    const clothing =
        /\b(ropa|moda|apparel|shirt|hoodie|jacket|pullover|sweatshirt|dress|top|tee|pants|shorts|leggings|swimwear|skirt|blouse|camiseta|sudadera|chaqueta|pantalon|pantalones|vestido|falda|blusa)\b/.test(all);

    if (!clothing) return "";
    if (kids) return "Ropa de niños";
    if (women) return "Ropa de mujer";
    if (men) return "Ropa de hombre";
    return "";
}

function filterCategory(cat) {
    const category = String(cat || "").toLowerCase();

    document.querySelectorAll(".cat-btn").forEach(button => {
        button.classList.toggle(
            "active",
            String(button.getAttribute("data-category") || "").toLowerCase() === category
        );
    });

    if (category === "todo" || category === "todos") {
        renderProducts(products);
        return;
    }

    const filtered = products.filter(product => {
        const base = String(product.category || "").toLowerCase();
        const audience = getProductAudienceCategory(product).toLowerCase();

        if ([
            "ropa de hombre", "ropa de mujer", "ropa de niños",
            "calzado de hombre", "calzado de mujer"
        ].includes(category)) {
            return audience === category;
        }

        if (["cuadros impresos", "arte impreso", "arte"].includes(category)) {
            return ["arte", "arte impreso", "cuadros impresos"].includes(base);
        }

        if (["accesorios", "accesorio"].includes(category)) {
            return ["accesorios", "accesorio"].includes(base) || getPrintifyCategory(product).toLowerCase() === "accesorios";
        }

        return base === category;
    });

    renderProducts(filtered);
}

function filterProducts() {
    const input = document.getElementById("searchInput");
    const query = String(input ? input.value : "").toLowerCase().trim();

    const filtered = products.filter(p => {
        const langData = i18n[currentLang] || i18n.es;
        const prodLang = langData[p.key] || i18n.es[p.key] || {};
        const originalName = String(p.titleCustom || prodLang.name || p.key || "");
        const displayedName = String(getProductDisplayName(p, originalName) || "");
        const category = String(p.category || getPrintifyCategory(p) || "");

        return !query ||
            displayedName.toLowerCase().includes(query) ||
            originalName.toLowerCase().includes(query) ||
            category.toLowerCase().includes(query);
    });

    renderProducts(filtered);
}

function addToCart(id) {
    const item = products.find(p => String(p.id) === String(id));
    if (!item) return;

    const variants = Array.isArray(item.printifyVariants)
        ? item.printifyVariants
        : [];

    if (variants.length > 0) {
        openProductModal(item.id);
        return;
    }

    cart.push({ ...item });
    updateCartUI();
}

function updateCartUI() {
    const count = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");
    if (!cartItems || !totalElement) return;

    if (count) count.textContent = cart.length;

    const langData = i18n[currentLang] || i18n["es"];
    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[char]);

    const money = value => (
        Number(value || 0) * rates[currentCurrency]
    ).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const totalUSD = cart.reduce(
        (sum, product) => sum + (Number(product.priceUSD) || 0), 0
    );

    if (!cart.length) {
        cartItems.innerHTML = '<div class="cart-empty">' + (currentLang === "en" ? "Your cart is empty." : "Tu carrito está vacío.") + '</div>';
    } else {
        cartItems.innerHTML = cart.map((product, index) => {
            const translation = langData[product.key] ||
                (i18n["es"] && i18n["es"][product.key]) || {};
            const name = getProductDisplayName(
                product,
                product.titleCustom || translation.name ||
                product.name || product.key || "Producto OMNIA"
            );

            const image = product.image ||
                (Array.isArray(product.images) ? product.images[0] : "") || "";

            const variant = product.selectedVariant;
            const definitions = Array.isArray(product.printifyOptions)
                ? product.printifyOptions : [];
            const options = variant && Array.isArray(variant.options)
                ? variant.options : [];

            const optionLabels = options.map((option, optionIndex) => {
                const definition = definitions[optionIndex] || {};
                const optionName = option && typeof option === "object"
                    ? (option.name || definition.title || definition.name || "")
                    : (definition.title || definition.name || "");

                let optionValue = option && typeof option === "object"
                    ? (option.value ?? option.title ?? option.name ?? option.id ?? "")
                    : option;

                const values = Array.isArray(definition.values)
                    ? definition.values : [];
                const matchingValue = values.find(value => {
                    const id = value && typeof value === "object"
                        ? (value.id ?? value.value) : value;
                    return String(id) === String(optionValue);
                });

                if (matchingValue !== undefined) {
                    optionValue = matchingValue && typeof matchingValue === "object"
                        ? (matchingValue.title ?? matchingValue.name ??
                           matchingValue.value ?? matchingValue.id)
                        : matchingValue;
                }

                return optionValue !== undefined && optionValue !== null &&
                    String(optionValue).trim()
                    ? `${optionName || (currentLang === "en" ? "Option" : "Opción")}: ${optionValue}`
                    : "";
            }).filter(Boolean);

            const variantTitle = optionLabels.length
                ? optionLabels.join(" · ")
                : (product.cartVariantTitle ||
                   (variant && variant.title) || "");

            return `
                <div class="cart-item-row">
                    ${image ? `
                        <img class="cart-item-image"
                             src="${escapeHTML(image)}"
                             alt="${escapeHTML(name)}"
                             loading="lazy"
                             onerror="this.style.display='none'">
                    ` : ""}
                    <div class="cart-item-info">
                        <span class="cart-item-name">${escapeHTML(name)}</span>
                        ${variantTitle ? `
                            <span class="cart-item-variant">
                                ${escapeHTML(variantTitle)}
                            </span>
                        ` : ""}
                        <span class="cart-item-quantity">Cantidad: 1</span>
                        <span class="cart-item-price">
                            ${escapeHTML(symbols[currentCurrency])}${money(product.priceUSD)}
                        </span>
                    </div>
                    <button type="button" class="cart-remove-btn"
                            onclick="removeFromCart(${index})">Eliminar</button>
                </div>
            `;
        }).join("");
    }

    totalElement.textContent =
        `${symbols[currentCurrency]}${money(totalUSD)}`;

    const cartModal = document.getElementById("cartModal");
    if (cartModal && cartModal.style.display === "flex") {
        initCartPayPalButton();
    }
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    const modal = document.getElementById("cartModal");
    if (!modal) return;

    const opening = modal.style.display !== "flex";
    modal.style.display = opening ? "flex" : "none";

    if (opening) initCartPayPalButton();
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
const tags = Array.isArray(item.tags)
? item.tags
: Array.isArray(item.etiquetas)
? item.etiquetas
: [];

const text = [
    item.titleCustom || "",
    item.title || "",
    item.name || "",
    item.description || "",
    item.descCustom || "",
    ...tags
].join(" ").toLowerCase()
 .normalize("NFD")
 .replace(/[\u0300-\u036f]/g, "");

if (
    /steering wheel|wheel cover|funda para volante|volante de coche|car accessory|desk mat|mouse pad|mousepad|alfombrilla|tapete de escritorio/.test(text)
) {
    return "Accesorios";
}

if (
    /\b(canvas|poster|wall art|art print|framed art|framed canvas|cuadro impreso|cuadros impresos|lamina decorativa|laminas decorativas)\b/.test(text)
) {
    return "Arte impreso";
}

if (
    /\b(calzado|sneaker|shoe|sandal|sandalia|chancla|clog|boot|slide|loafer|zapatillas|zapato|zapatos)\b/.test(text)
) {
    return "Calzado";
}

if (
    /\b(ropa|apparel|shirt|hoodie|jacket|pullover|sweatshirt|dress|top|tee|pants|shorts|leggings|swimwear|skirt|blouse|camiseta|sudadera|chaqueta|pantalon|vestido|falda|blusa)\b/.test(text)
) {
    return "Ropa";
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
    const res = await fetch(
        `${OMNIA_API_BACKEND}/api/catalog/omnia`
    );

    if (!res.ok) {
        throw new Error(`Error HTTP catálogo OMNIA: ${res.status}`);
    }

    const json = await res.json();

    if (
        json.status !== "success" ||
        !Array.isArray(json.products)
    ) {
        throw new Error("Respuesta del catálogo OMNIA no válida.");
    }

    return json.products;
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


function getPrintifyImages(item) {
    const sourceImages = Array.isArray(item?.images)
        ? item.images
        : (item?.image ? [item.image] : []);

    return sourceImages
        .map(image => {
            if (typeof image === "string") return image;
            return image && (image.src || image.url)
                ? image.src || image.url
                : "";
        })
        .filter((src, index, all) =>
            typeof src === "string" && src.trim() && all.indexOf(src) === index
        );
}

function getPrintifyVariantPrice(variant) {
    if (!variant || variant.price === null || variant.price === undefined) {
        return null;
    }

    const price = Number(variant.price);

    if (!Number.isFinite(price) || price <= 0) {
        return null;
    }

    return price / 100;
}

async function loadPrintifyCatalog() {
    try {
        const printifyProducts = (await syncPrintifyProducts())
            .filter(item => item && item.id && item.is_published === true);

        const existingPrintifyKeys = new Set(
            products
                .filter(p => p.key && p.key.startsWith("printify_"))
                .map(p => p.key)
        );

        const printifyItems = printifyProducts
            .filter(item => !existingPrintifyKeys.has(`printify_${item.id}`))
            .map(item => {
                const images = getPrintifyImages(item);

                const variants = Array.isArray(item.variants)
                    ? item.variants.filter(v =>
                        v &&
                        v.enabled !== false &&
                        v.is_enabled !== false &&
                        v.is_available !== false
                    )
                    : [];

                const validVariants = variants
                    .map(variant => ({
                        ...variant,
                        priceUSD: getPrintifyVariantPrice(variant)
                    }))
                    .filter(variant => variant.priceUSD !== null);

                if (validVariants.length === 0) {
                    console.warn(
                        "Producto Printify omitido: no tiene variantes con precio válido.",
                        item.id
                    );
                    return null;
                }

                const description = typeof item.description === "string"
                    ? item.description.trim()
                    : "";

                return {
                    id: createPrintifyProductId(String(item.id)),
                    key: `printify_${item.id}`,
                    priceUSD: validVariants[0].priceUSD,
                    category: getPrintifyCategory(item),
                    audienceCategory: getProductAudienceCategory(item),
                    tags: Array.isArray(item.tags)
                        ? item.tags
                        : Array.isArray(item.etiquetas)
                            ? item.etiquetas
                            : [],
                    image: images[0] || "",
                    images,
                    printifyImageVariants: (
                        Array.isArray(item.images)
                            ? item.images
                            : (item.image ? [item.image] : [])
                    ).map(image => {
                        if (typeof image === "string") {
                            return { src: image, variant_ids: [] };
                        }
                        return {
                            src: image && (image.src || image.url)
                                ? (image.src || image.url) : "",
                            variant_ids: image && Array.isArray(image.variant_ids)
                                ? image.variant_ids : []
                        };
                    }).filter(image => image.src),
                    titleCustom: item.title || "Producto OMNIA",
                    descCustom: description,
                    printifyId: item.id,
                    printifyShopId: item.shop_id || null,
                    printifyVariants: validVariants,
                    printifyOptions: Array.isArray(item.options)
                        ? item.options
                        : []
                };
            })
            .filter(Boolean);

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
        console.error(
            "Sincronización Printify no disponible:",
            err.message
        );
    }
}


document.addEventListener("click", event => {
    const img = event.target.closest(".cart-item-image");
    if (!img) return;

    event.preventDefault();
    const source = img.currentSrc || img.src;
    if (!source) return;

    openProductZoom([source], img.alt || "Imagen del producto");
});

document.addEventListener("DOMContentLoaded", () => {
    loadPrintifyCatalog();
    syncEbayInventory();
});
