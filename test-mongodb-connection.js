const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE_URL;

console.log('🔍 Probando conexión a MongoDB Atlas...\n');
console.log('URI (sin credenciales):', uri.replace(/:[^:@]+@/, ':****@'));
console.log('\n⏳ Conectando...\n');

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
    
    // Probar una operación simple
    const db = client.db('pulgashop');
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Colecciones encontradas: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
  } catch (error) {
    console.error('❌ Error de conexión:');
    console.error('   Tipo:', error.name);
    console.error('   Mensaje:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Solución: DNS no puede resolver el host de MongoDB');
      console.error('   - Verifica tu conexión a internet');
      console.error('   - La red puede estar bloqueando mongodb.net');
      console.error('   - Intenta conectarte desde otra red (móvil, casa)');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
      console.error('\n💡 Solución: Timeout de conexión');
      console.error('   - El firewall de la red está bloqueando el puerto 27017');
      console.error('   - Usa una VPN o conexión móvil');
      console.error('   - Considera MongoDB local para desarrollo');
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Solución: Error de autenticación');
      console.error('   - Verifica usuario y contraseña en .env');
      console.error('   - Revisa las credenciales en MongoDB Atlas');
    }
  } finally {
    await client.close();
  }
}

testConnection();
