using System;
using System.IO;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Microsoft.Extensions.Configuration;

namespace sistemaTickets_backend.DataAccess
{
    public class FirebaseContext
    {
        private readonly FirestoreDb _firestoreDb;
        private static bool _initialized = false;
        private static readonly object _lock = new object();

        public FirebaseContext(IConfiguration configuration)
        {
            // Inicializar FirebaseApp solo una vez (Singleton)
            if (!_initialized)
            {
                lock (_lock)
                {
                    if (!_initialized && FirebaseApp.DefaultInstance == null)
                    {
                        // 🔹 Leer directamente la variable de entorno
                        var credentialPath = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS");

                        if (string.IsNullOrEmpty(credentialPath))
                            throw new InvalidOperationException("No se encontró la variable de entorno GOOGLE_APPLICATION_CREDENTIALS.");

                        if (!File.Exists(credentialPath))
                            throw new FileNotFoundException($"No se encontró el archivo de credenciales en: {credentialPath}");

                        FirebaseApp.Create(new AppOptions()
                        {
                            Credential = GoogleCredential.FromFile(credentialPath)
                        });

                        _initialized = true;
                    }
                }
            }

            // Crear instancia de FirestoreDb
            var projectId = configuration["Firebase:ProjectId"];
            _firestoreDb = FirestoreDb.Create(projectId);
        }

        public FirestoreDb Firestore => _firestoreDb;
    }
}
