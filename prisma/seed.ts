import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  // Categorías iniciales para un marketplace tipo Mercado Libre
  const categorias = [
    {
      nombre: 'Electrónica',
      descripcion: 'Dispositivos electrónicos, computadoras, celulares y accesorios',
      icono: 'electronics',
      activa: true,
    },
    {
      nombre: 'Moda',
      descripcion: 'Ropa, zapatos, accesorios y artículos de moda',
      icono: 'clothing',
      activa: true,
    },
    {
      nombre: 'Hogar y Muebles',
      descripcion: 'Muebles, decoración y artículos para el hogar',
      icono: 'home',
      activa: true,
    },
    {
      nombre: 'Deportes',
      descripcion: 'Artículos deportivos, equipamiento y ropa deportiva',
      icono: 'sports',
      activa: true,
    },
    {
      nombre: 'Juguetes',
      descripcion: 'Juguetes para niños y coleccionables',
      icono: 'toys',
      activa: true,
    },
    {
      nombre: 'Libros',
      descripcion: 'Libros, revistas y material de lectura',
      icono: 'books',
      activa: true,
    },
    {
      nombre: 'Automóviles',
      descripcion: 'Vehículos, repuestos y accesorios automotrices',
      icono: 'car',
      activa: true,
    },
    {
      nombre: 'Servicios',
      descripcion: 'Servicios profesionales y personales',
      icono: 'services',
      activa: true,
    },
    {
      nombre: 'Herramientas',
      descripcion: 'Herramientas de trabajo y construcción',
      icono: 'tools',
      activa: true,
    },
    {
      nombre: 'Otros',
      descripcion: 'Artículos varios que no entran en otras categorías',
      icono: 'other',
      activa: true,
    },
  ];

  for (const categoria of categorias) {
    const existente = await prisma.categoria.findUnique({
      where: { nombre: categoria.nombre },
    });

    if (!existente) {
      await prisma.categoria.create({
        data: categoria,
      });
      console.log(`✓ Categoría creada: ${categoria.nombre}`);
    } else {
      console.log(`- Categoría ya existe: ${categoria.nombre}`);
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
