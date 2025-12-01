const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://DanielBelozo:XRNc6f7PVTLNEFmp@pulgashoppost.7txazxa.mongodb.net/pulgashop?retryWrites=true&w=majority';

async function deleteAll() {
  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('🔌 Conectado a MongoDB\n');

    const db = client.db();
    
    // Listar todas las bases de datos
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log('📚 Bases de datos disponibles:');
    dbs.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });
    console.log();

    // Trabajar con la base de datos pulgashop
    const publicacionesCollection = db.collection('publicacion');
    const multimediaCollection = db.collection('multimedia');
    const moderacionCollection = db.collection('moderacion');

    console.log('🔍 Verificando colecciones en la base de datos "pulgashop"...\n');

    const totalPublicaciones = await publicacionesCollection.countDocuments();
    const totalMultimedia = await multimediaCollection.countDocuments();
    const totalModeraciones = await moderacionCollection.countDocuments();

    console.log(`📊 Total de documentos:`);
    console.log(`  - Publicaciones: ${totalPublicaciones}`);
    console.log(`  - Multimedia: ${totalMultimedia}`);
    console.log(`  - Moderaciones: ${totalModeraciones}\n`);

    if (totalPublicaciones > 0) {
      console.log('📋 Mostrando algunas publicaciones:');
      const samples = await publicacionesCollection.find({}).limit(5).toArray();
      samples.forEach((pub, i) => {
        console.log(`\n${i + 1}. ${pub.titulo}`);
        console.log(`   id_vendedor: ${pub.id_vendedor} (tipo: ${typeof pub.id_vendedor})`);
        console.log(`   id_tienda: ${pub.id_tienda}`);
        console.log(`   id_producto: ${pub.id_producto}`);
        console.log(`   sku: ${pub.sku}`);
      });
    }

    if (totalPublicaciones > 0 || totalMultimedia > 0 || totalModeraciones > 0) {
      console.log('\n\n⚠️  ELIMINANDO TODOS LOS DATOS...\n');

      const multimediaResult = await multimediaCollection.deleteMany({});
      console.log(`✅ Eliminadas ${multimediaResult.deletedCount} multimedia`);

      const moderacionResult = await moderacionCollection.deleteMany({});
      console.log(`✅ Eliminadas ${moderacionResult.deletedCount} moderaciones`);

      const publicacionesResult = await publicacionesCollection.deleteMany({});
      console.log(`✅ Eliminadas ${publicacionesResult.deletedCount} publicaciones`);

      console.log('\n✨ Base de datos limpiada completamente.');
      console.log('\n📝 Ahora ejecuta el seed:');
      console.log('   pnpm run prisma:seed');
    } else {
      console.log('✅ Base de datos ya está limpia.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

deleteAll();
