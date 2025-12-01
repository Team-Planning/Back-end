const { MongoClient, ObjectId } = require('mongodb');

// URL de conexión directa desde .env
const DATABASE_URL = 'mongodb+srv://DanielBelozo:XRNc6f7PVTLNEFmp@pulgashoppost.7txazxa.mongodb.net/pulgashop?retryWrites=true&w=majority';

async function fixNumericIds() {
  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('🔌 Conectado a MongoDB\n');

    const db = client.db();
    const publicacionesCollection = db.collection('publicacion');
    const multimediaCollection = db.collection('multimedia');
    const moderacionCollection = db.collection('moderacion');

    console.log('🔍 Buscando publicaciones con IDs no numéricos...\n');

    // Buscar publicaciones con problemas
    const publicacionesConProblemas = await publicacionesCollection.find({
      $or: [
        { id_vendedor: { $type: 'string' } },
        { id_tienda: { $type: 'string' } },
        { sku: { $exists: false } }
      ]
    }).toArray();

    console.log(`📊 Encontradas ${publicacionesConProblemas.length} publicaciones con problemas:\n`);

    if (publicacionesConProblemas.length === 0) {
      console.log('✅ No hay publicaciones con problemas de tipo.');
      return;
    }

    // Mostrar detalles de las publicaciones problemáticas
    publicacionesConProblemas.forEach((pub, index) => {
      console.log(`\n${index + 1}. Publicación ID: ${pub._id}`);
      console.log(`   - id_vendedor: ${pub.id_vendedor} (tipo: ${typeof pub.id_vendedor})`);
      console.log(`   - id_tienda: ${pub.id_tienda} (tipo: ${typeof pub.id_tienda})`);
      console.log(`   - id_producto: ${pub.id_producto}`);
      console.log(`   - sku: ${pub.sku ?? 'NO EXISTE'}`);
      console.log(`   - titulo: ${pub.titulo}`);
    });

    console.log('\n⚠️  OPCIONES:');
    console.log('1. Eliminar estas publicaciones (recomendado si son datos de prueba)');
    console.log('2. Intentar convertir IDs a números (solo si son convertibles)\n');

    // Para este script, vamos a eliminar las publicaciones problemáticas
    console.log('🗑️  Eliminando publicaciones con datos inconsistentes...\n');

    for (const pub of publicacionesConProblemas) {
      try {
        const pubId = pub._id.toString();

        // Primero eliminar multimedia asociada
        const multimediaResult = await multimediaCollection.deleteMany({
          id_publicacion: pubId
        });
        console.log(`   📎 Eliminadas ${multimediaResult.deletedCount} multimedia`);

        // Luego eliminar moderaciones asociadas
        const moderacionResult = await moderacionCollection.deleteMany({
          id_publicacion: pubId
        });
        console.log(`   🔍 Eliminadas ${moderacionResult.deletedCount} moderaciones`);

        // Finalmente eliminar la publicación
        await publicacionesCollection.deleteOne({ _id: pub._id });

        console.log(`✅ Eliminada publicación: ${pub.titulo}\n`);
      } catch (error) {
        console.error(`❌ Error eliminando publicación ${pub._id}: ${error.message}`);
      }
    }

    console.log('\n✅ Proceso completado. Verifica que el schema esté correcto y ejecuta:');
    console.log('   pnpm prisma:generate');
    console.log('   pnpm run start:dev\n');

  } catch (error) {
    console.error('❌ Error en el script:', error);
  } finally {
    await client.close();
  }
}

fixNumericIds();
