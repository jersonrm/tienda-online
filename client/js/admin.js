export function showAdminPanel() {
  const app = document.querySelector('#app');
  if (!app) return;

  app.innerHTML = `
    <div class="admin-panel">
      <h2>Panel de Administrador</h2>
      <form id="addProductForm" class="admin-form">
        <input type="text" name="name" placeholder="Nombre del producto" required>
        <input type="number" name="price" placeholder="Precio" required>
        <input type="text" name="image" placeholder="URL de la imagen">
        <textarea name="description" placeholder="Descripción"></textarea>
        <input type="number" name="stock" placeholder="Stock disponible" required>
        <button type="submit">Agregar Producto</button>
      </form>
    </div>
  `;

  document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert('Producto agregado exitosamente');
        e.target.reset();
      } else {
        throw new Error('Error al agregar producto');
      }
    } catch (error) {
      alert(error.message);
    }
  });
}
