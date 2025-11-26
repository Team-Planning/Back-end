const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migratePublicaciones() {
  console.log('🔄 Iniciando migración: Agregando id_tienda a publicaciones existentes...\n');

  try {
    // Buscar publicaciones sin id_tienda
    const publicacionesSinTienda = await prisma.publicacion.findMany({
      where: {
        id_tienda: null
      }
    });

    console.log(`📊 Publicaciones encontradas sin id_tienda: ${publicacionesSinTienda.length}`);

    if (publicacionesSinTienda.length === 0) {
      console.log('✅ No hay publicaciones que migrar.');
      return;
    }

    // Actualizar cada publicación
    let actualizadas = 0;
    for (const pub of publicacionesSinTienda) {
      // Asignar un id_tienda por defecto basado en el id_vendedor
      const id_tienda = `tienda_${pub.id_vendedor}`;
      
      await prisma.publicacion.update({
        where: { id: pub.id },
        data: { id_tienda }
      });

      actualizadas++;
      console.log(`  ✓ Publicación "${pub.titulo}" actualizada con id_tienda: ${id_tienda}`);
    }

    console.log(`\n✅ Migración completada! ${actualizadas} publicaciones actualizadas.`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migratePublicaciones();
