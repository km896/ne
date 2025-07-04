        function obtenerCompras() {
            return JSON.parse(localStorage.getItem('compras') || '[]');
        }

        function guardarCompras(compras) {
            localStorage.setItem('compras', JSON.stringify(compras));
        }

        function calcularPagoMensual(precio, plazo) {
            const tasaAnual = 0.12;
            const interesTotal = precio * tasaAnual * (plazo / 12);
            const totalAPagar = precio + interesTotal;
            return (totalAPagar / plazo).toFixed(2);
        }

        function mostrarCompras(comprasFiltradas = obtenerCompras()) {
            const comprasList = document.getElementById('comprasList');
            const totalCompras = document.getElementById('totalCompras');
            const montoTotal = document.getElementById('montoTotal');
            if (!comprasList || !totalCompras || !montoTotal) {
                console.error('Elementos del DOM no encontrados');
                return;
            }

            comprasList.innerHTML = '';
            if (comprasFiltradas.length === 0) {
                comprasList.innerHTML = '<p class="no-compras">No hay compras registradas.</p>';
                totalCompras.textContent = '0';
                montoTotal.textContent = '0';
                return;
            }

            comprasFiltradas.forEach((compra, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                let financiamientoInfo = '';
                if (compra.metodoPago === 'financiado' && compra.plazoFinanciamiento) {
                    const pagoMensual = calcularPagoMensual(compra.precio, compra.plazoFinanciamiento);
                    financiamientoInfo = `
                        <p><strong>Plazo:</strong> ${compra.plazoFinanciamiento} meses</p>
                        <p><strong>Pago Mensual:</strong> $${parseFloat(pagoMensual).toLocaleString('es-MX')} MXN</p>
                    `;
                }
                card.innerHTML = `
                    <p><strong>Auto:</strong> ${compra.auto}</p>
                    <p><strong>Precio:</strong> $${compra.precio.toLocaleString('es-MX')} MXN</p>
                    <p><strong>Nombre:</strong> ${compra.nombre}</p>
                    <p><strong>Email:</strong> ${compra.email}</p>
                    <p><strong>Método de Pago:</strong> ${compra.metodoPago}</p>
                    ${financiamientoInfo}
                    <p><strong>Fecha:</strong> ${compra.fecha}</p>
                    <div class="card-buttons">
                        <button class="btn" onclick="descargarTicket(${index})">Descargar Ticket</button>
                        <button class="btn btn-delete" onclick="eliminarCompra(${index})">Eliminar</button>
                    </div>
                `;
                comprasList.appendChild(card);
            });

            totalCompras.textContent = comprasFiltradas.length;
            const total = comprasFiltradas.reduce((sum, compra) => sum + compra.precio, 0);
            montoTotal.textContent = total.toLocaleString('es-MX');
        }

        function descargarTicket(index) {
            const compras = obtenerCompras();
            const compra = compras[index];
            if (!compra) {
                alert('Error: Compra no encontrada');
                return;
            }

            const {
                jsPDF
            } = window.jspdf;
            const doc = new jsPDF();

            const verde = [46, 125, 50];
            const grisClaro = [240, 240, 240];


            doc.setFillColor(...verde);
            doc.rect(0, 0, 210, 30, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20);
            doc.text('Concesionario de Nery', 20, 20);

            try {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = 'hondaC.jpg';
                img.onload = function() {
                    doc.addImage(img, 'JPEG', 160, 10, 30, 15);
                    continuarPDF();
                };
                img.onerror = continuarPDF;
            } catch (e) {
                continuarPDF();
            }

            function continuarPDF() {
                doc.setFontSize(14);
                doc.setTextColor(0, 0, 0);
                doc.text('Ticket de Compra', 20, 40);

                doc.autoTable({
                    startY: 50,
                    head: [
                        ['Campo', 'Valor']
                    ],
                    body: [
                        ['Auto', compra.auto],
                        ['Precio', `$${compra.precio.toLocaleString('es-MX')} MXN`],
                        ['Nombre', compra.nombre],
                        ['Email', compra.email],
                        ['Método de Pago', compra.metodoPago],
                        ['Fecha', compra.fecha]
                    ],
                    theme: 'grid',
                    headStyles: {
                        fillColor: verde,
                        textColor: [255, 255, 255]
                    },
                    alternateRowStyles: {
                        fillColor: grisClaro
                    },
                    margin: {
                        left: 20,
                        right: 20
                    }
                });

                if (compra.metodoPago === 'financiado' && compra.plazoFinanciamiento) {
                    const pagoMensual = calcularPagoMensual(compra.precio, compra.plazoFinanciamiento);
                    doc.setFontSize(12);
                    doc.text('Detalles de Financiamiento', 20, doc.lastAutoTable.finalY + 10);
                    doc.autoTable({
                        startY: doc.lastAutoTable.finalY + 20,
                        head: [
                            ['Campo', 'Valor']
                        ],
                        body: [
                            ['Plazo', `${compra.plazoFinanciamiento} meses`],
                            ['Tasa de Interés', '12% anual'],
                            ['Pago Mensual', `$${parseFloat(pagoMensual).toLocaleString('es-MX')} MXN`]
                        ],
                        theme: 'grid',
                        headStyles: {
                            fillColor: verde,
                            textColor: [255, 255, 255]
                        },
                        alternateRowStyles: {
                            fillColor: grisClaro
                        },
                        margin: {
                            left: 20,
                            right: 20
                        }
                    });
                }

                doc.setFillColor(...verde);
                doc.rect(0, 277, 210, 20, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.text('Gracias por su compra! Contacto: contacto@autosneryy.com', 20, 287);

                doc.save(`ticket_compra_${compra.auto}_${compra.fecha.replace(/[:\/]/g, '-')}.pdf`);
            }
        }

        function eliminarCompra(index) {
            if (!confirm('¿Estás seguro de eliminar esta compra?')) return;
            const compras = obtenerCompras();
            compras.splice(index, 1);
            guardarCompras(compras);
            mostrarCompras();
        }

        function filtrarCompras() {
            const filtro = document.getElementById('filtroEmail').value.toLowerCase().trim();
            const compras = obtenerCompras();
            const comprasFiltradas = filtro ?
                compras.filter(compra => compra.email.toLowerCase().includes(filtro)) :
                compras;
            mostrarCompras(comprasFiltradas);
        }

        document.getElementById('filtroEmail').addEventListener('input', filtrarCompras);

        document.addEventListener('DOMContentLoaded', () => {
            mostrarCompras();
        });
