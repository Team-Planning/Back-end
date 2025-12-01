const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    console.log('🔍 Conectando con Prisma Client...\n');

    const publicaciones = await prisma.publicacion.findMany({
      include: {
        multimedia: true
      }
    });

    console.log(`📊 Total de publicaciones encontradas: ${publicaciones.length}\n`);

    publicaciones.forEach((pub, index) => {
      console.log(`${index + 1}. ${pub.titulo}`);
      console.log(`   ID: ${pub.id}`);
      console.log(`   id_vendedor: ${pub.id_vendedor} (tipo: ${typeof pub.id_vendedor})`);
      console.log(`   id_tienda: ${pub.id_tienda} (tipo: ${typeof pub.id_tienda})`);
      console.log(`   id_producto: ${pub.id_producto} (tipo: ${typeof pub.id_producto})`);
      console.log(`   sku: ${pub.sku} (tipo: ${typeof pub.sku})`);
      console.log(`   estado: ${pub.estado}`);
      console.log(`   multimedia: ${pub.multimedia.length} archivos\n`);
    });

    if (publicaciones.length === 0) {
      console.log('⚠️  No se encontraron publicaciones.');
      console.log('Verifica que el seed se haya ejecutado correctamente.');
    } else {
      console.log('✅ Todas las publicaciones tienen los tipos correctos!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
