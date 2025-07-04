      const autos = [{
            id: 1,
            marca: "Toyota",
            modelo: "Corolla",
            ano: 2020,
            precio: 400000,
            imagen: "imagenes/toyotaC.jpg"
        }, {
            id: 2,
            marca: "Honda",
            modelo: "Civic",
            ano: 2021,
            precio: 440000,
            imagen: "imagenes/hondaC.jpg"
        }, {
            id: 3,
            marca: "Ford",
            modelo: "Mustang",
            ano: 2019,
            precio: 600000,
            imagen: "imagenes/fordM.jpg"
        }, {
            id: 4,
            marca: "Chevrolet",
            modelo: "Camaro",
            ano: 2022,
            precio: 700000,
            imagen: "imagenes/chevroletC.jpg"
        }, {
            id: 5,
            marca: "Nissan",
            modelo: "Sentra",
            ano: 2020,
            precio: 360000,
            imagen: "imagenes/nissanS.jpg"
        }, {
            id: 6,
            marca: "Volkswagen",
            modelo: "Jetta",
            ano: 2021,
            precio: 420000,
            imagen: "imagenes/jetta.jpg"
        }, {
            id: 7,
            marca: "BMW",
            modelo: "Series 3",
            ano: 2023,
            precio: 800000,
            imagen: "imagenes/bmw3.jpg"
        }, {
            id: 8,
            marca: "Hyundai",
            modelo: "Tucson",
            ano: 2022,
            precio: 500000,
            imagen: "imagenes/hyundaiT.jpg"
        }, {
            id: 9,
            marca: "Kia",
            modelo: "Forte",
            ano: 2020,
            precio: 380000,
            imagen: "imagenes/kiaF.jpg"
        }, {
            id: 10,
            marca: "Mercedes-Benz",
            modelo: "C-Class",
            ano: 2021,
            precio: 840000,
            imagen: "imagenes/mercedezC.jpg"
        }];

        function mostrarAutos(autosFiltrados = autos) {
            const carList = document.getElementById('carList');
            if (!carList) {
                console.error('Elemento carList no encontrado');
                return;
            }
            carList.innerHTML = '';
            if (!autosFiltrados || autosFiltrados.length === 0) {
                carList.innerHTML = '<p>No se encontraron autos.</p>';
                return;
            }
            autosFiltrados.forEach(auto => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${auto.imagen}" alt="${auto.marca} ${auto.modelo}">
                    <h3>${auto.marca} ${auto.modelo}</h3>
                    <p>Año: ${auto.ano}</p>
                    <p>Precio: $${auto.precio.toLocaleString('es-MX')} MXN</p>
                    <button class="btn" onclick="abrirModal(${auto.id})">Comprar</button>
                `;
                carList.appendChild(card);
            });
        }
        function abrirModal(autoId) {
            const modal = document.getElementById('compraModal');
            const autoIdInput = document.getElementById('autoId');
            if (!modal || !autoIdInput) {
                console.error('Modal o autoIdInput no encontrado');
                return;
            }
            autoIdInput.value = autoId;
            modal.style.display = 'flex';
            actualizarPlazoVisibility();
        }


        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const modal = document.getElementById('compraModal');
                if (modal) modal.style.display = 'none';
            });
        }

        function actualizarPlazoVisibility() {
            const metodoPago = document.getElementById('metodoPago').value;
            const plazoField = document.getElementById('plazoFinanciamiento');
            const plazoLabel = document.getElementById('plazoLabel');
            if (metodoPago === 'financiado') {
                plazoField.style.display = 'block';
                plazoLabel.style.display = 'block';
                plazoField.required = true;
            } else {
                plazoField.style.display = 'none';
                plazoLabel.style.display = 'none';
                plazoField.required = false;
            }
        }

        document.getElementById('metodoPago').addEventListener('change', actualizarPlazoVisibility);

        const compraForm = document.getElementById('compraForm');
        if (compraForm) {
            compraForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const autoId = document.getElementById('autoId').value;
                const nombre = document.getElementById('nombre').value;
                const email = document.getElementById('email').value;
                const metodoPago = document.getElementById('metodoPago').value;
                const plazoFinanciamiento = metodoPago === 'financiado' ?
                    document.getElementById('plazoFinanciamiento').value :
                    null;

                const auto = autos.find(a => a.id == autoId);
                if (!auto) {
                    alert('Error: Auto no encontrado');
                    return;
                }

                const compra = {
                    auto: `${auto.marca} ${auto.modelo}`,
                    precio: auto.precio,
                    nombre,
                    email,
                    metodoPago,
                    plazoFinanciamiento,
                    fecha: new Date().toLocaleString('es-MX')
                };

                let compras = JSON.parse(localStorage.getItem('compras') || '[]');
                compras.push(compra);
                localStorage.setItem('compras', JSON.stringify(compras));

                alert('Compra simulada exitosamente. Revisa "Mis Compras" para ver los detalles.');
                document.getElementById('compraModal').style.display = 'none';
                this.reset();
                actualizarPlazoVisibility();
            });
        }

        const filtroMarca = document.getElementById('filtroMarca');
        if (filtroMarca) {
            filtroMarca.addEventListener('input', function() {
                const filtro = this.value.toLowerCase().trim();
                const autosFiltrados = autos.filter(auto =>
                    auto.marca.toLowerCase().includes(filtro)
                );
                mostrarAutos(autosFiltrados);
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            mostrarAutos();
        });
