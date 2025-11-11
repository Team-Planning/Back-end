import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  // Publicaciones de ejemplo para el marketplace
  const publicacionesEjemplo = [
    {
      id_vendedor: 'vendedor_001',
      id_producto: 'producto_001',
      titulo: 'Laptop HP Pavilion - Excelente estado',
      descripcion: 'Vendo laptop HP Pavilion 15, procesador Intel Core i5, 8GB RAM, 256GB SSD. En excelente estado, poco uso.',
      despacho: 'envio',
      precio_envio: 5000,
    },
    {
      id_vendedor: 'vendedor_002',
      id_producto: 'producto_002',
      titulo: 'Bicicleta MTB Aro 29',
      descripcion: 'Bicicleta de montaña aro 29, marca Trek. Incluye accesorios. Ideal para ciclismo de montaña.',
      despacho: 'retiro_en_tienda',
    },
    {
      id_vendedor: 'vendedor_003',
      id_producto: 'producto_003',
      titulo: 'Set de herramientas profesional',
      descripcion: 'Set completo de herramientas para mecánica y carpintería. 150 piezas, incluye maletín.',
      despacho: 'ambos',
      precio_envio: 3000,
    },
  ];

  console.log('Creando publicaciones de ejemplo...');
  
  for (const pub of publicacionesEjemplo) {
    try {
      await prisma.publicacion.create({
        data: pub,
      });
      console.log(`✓ Publicación creada: ${pub.titulo}`);
    } catch (error) {
      console.log(`- Error o publicación ya existe: ${pub.titulo}`);
    }
  }

  console.log('Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
