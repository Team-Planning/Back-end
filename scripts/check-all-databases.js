const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://DanielBelozo:XRNc6f7PVTLNEFmp@pulgashoppost.7txazxa.mongodb.net/?retryWrites=true&w=majority';

async function checkAllDatabases() {
  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('🔌 Conectado a MongoDB Atlas\n');

    const adminDb = client.db().admin();
    const dbList = await adminDb.listDatabases();

    console.log('📚 Todas las bases de datos en el cluster:\n');

    for (const dbInfo of dbList.databases) {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`📦 Base de datos: ${dbInfo.name}`);
      console.log(`   Tamaño: ${(dbInfo.sizeOnDisk / 1024 / 1024).toFixed(2)} MB`);
      console.log(`${'='.repeat(50)}`);

      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();

      if (collections.length > 0) {
        console.log('\n📁 Colecciones:');
        for (const col of collections) {
          const collection = db.collection(col.name);
          const count = await collection.countDocuments();
          console.log(`   - ${col.name}: ${count} documentos`);

          if (col.name === 'publicacion' && count > 0) {
            const samples = await collection.find({}).limit(2).toArray();
            console.log(`     Ejemplos:`);
            samples.forEach((doc, i) => {
              console.log(`       ${i + 1}. titulo: ${doc.titulo}`);
              console.log(`          id_vendedor: ${doc.id_vendedor} (tipo: ${typeof doc.id_vendedor})`);
              console.log(`          id_tienda: ${doc.id_tienda}`);
              console.log(`          id_producto: ${doc.id_producto}`);
              console.log(`          sku: ${doc.sku}`);
            });
          }
        }
      } else {
        console.log('   (vacía)');
      }
    }

    console.log('\n\n🎯 BASE DE DATOS OBJETIVO SEGÚN .env:');
    console.log('   DATABASE_URL apunta a: pulgashop');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkAllDatabases();
