const { MongoClient } = require('mongodb');

const DATABASE_URL = 'mongodb+srv://DanielBelozo:XRNc6f7PVTLNEFmp@pulgashoppost.7txazxa.mongodb.net/pulgashop?retryWrites=true&w=majority';

async function cleanOldCollections() {
  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('🔌 Conectado a MongoDB\n');

    const db = client.db();
    
    console.log('🗑️  Eliminando colecciones viejas con datos incompatibles...\n');

    // Eliminar colección 'publicaciones' (plural - datos viejos)
    try {
      await db.collection('publicaciones').drop();
      console.log('✅ Colección "publicaciones" (plural) eliminada');
    } catch (error) {
      if (error.codeName === 'NamespaceNotFound') {
        console.log('ℹ️  Colección "publicaciones" no existe');
      } else {
        throw error;
      }
    }

    // Eliminar colección 'moderaciones' (plural - datos viejos)
    try {
      await db.collection('moderaciones').drop();
      console.log('✅ Colección "moderaciones" (plural) eliminada');
    } catch (error) {
      if (error.codeName === 'NamespaceNotFound') {
        console.log('ℹ️  Colección "moderaciones" no existe');
      } else {
        throw error;
      }
    }

    console.log('\n✨ Limpieza completada!');
    console.log('\n📝 Ahora el sistema usará las colecciones correctas:');
    console.log('   - publicacion (singular)');
    console.log('   - multimedia');
    console.log('   - moderacion (singular)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

cleanOldCollections();
