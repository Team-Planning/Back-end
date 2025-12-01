const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://DanielBelozo:XRNc6f7PVTLNEFmp@pulgashoppost.7txazxa.mongodb.net/pulgashop?retryWrites=true&w=majority';

async function checkAllPublicaciones() {
  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('🔌 Conectado a MongoDB\n');

    const db = client.db();
    const publicacionesCollection = db.collection('publicacion');

    // Contar total
    const total = await publicacionesCollection.countDocuments();
    console.log(`📊 Total de publicaciones: ${total}\n`);

    // Obtener todas las publicaciones
    const publicaciones = await publicacionesCollection.find({}).limit(50).toArray();

    console.log('🔍 Primeras 50 publicaciones:\n');
    publicaciones.forEach((pub, index) => {
      console.log(`${index + 1}. ${pub.titulo || 'Sin título'}`);
      console.log(`   ID: ${pub._id}`);
      console.log(`   id_vendedor: ${pub.id_vendedor} (tipo: ${typeof pub.id_vendedor})`);
      console.log(`   id_tienda: ${pub.id_tienda} (tipo: ${typeof pub.id_tienda})`);
      console.log(`   id_producto: ${pub.id_producto} (tipo: ${typeof pub.id_producto})`);
      console.log(`   sku: ${pub.sku ?? 'NO EXISTE'} (tipo: ${typeof pub.sku})\n`);
    });

    // Buscar específicamente strings en id_vendedor
    const withStringVendedor = await publicacionesCollection.countDocuments({
      id_vendedor: { $type: 'string' }
    });
    console.log(`\n📈 Publicaciones con id_vendedor string: ${withStringVendedor}`);

    // Buscar strings en id_tienda
    const withStringTienda = await publicacionesCollection.countDocuments({
      id_tienda: { $type: 'string' }
    });
    console.log(`📈 Publicaciones con id_tienda string: ${withStringTienda}`);

    // Buscar sin sku
    const withoutSku = await publicacionesCollection.countDocuments({
      sku: { $exists: false }
    });
    console.log(`📈 Publicaciones sin sku: ${withoutSku}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkAllPublicaciones();
