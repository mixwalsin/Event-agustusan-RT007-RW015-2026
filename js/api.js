/* ========================================================
   SEMARAK AGUSTUS 2026 - MODULAR API SCRIPT
   Client-side Hub for Supabase & LocalStorage Database
   ======================================================== */

const SUPABASE_URL = "https://tjrqubmjndqxlwcrrszl.supabase.co"; 
const SUPABASE_KEY = "tjrqubmjndgxlwcrrszl";

const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : {
    from: () => ({
        insert: async () => ({ data: [], error: null }),
        select: () => ({
            eq: () => ({
                order: async () => ({ data: [], error: null })
            }),
            order: async () => ({ data: [], error: null })
        })
    })
};

// Global API Object
const EventAPI = {
    // --- CABOR REGISTRATION ---
    async registerCabor(namaWarga, nomorRumah, sport, tahunBerjalan) {
        return await supabase
            .from('pendaftaran_cabor')
            .insert([
                {
                    nama_warga: namaWarga,
                    nomor_rumah: nomorRumah,
                    cabang_olahraga: sport,
                    tahun_event: tahunBerjalan
                }
            ]);
    },

    async getRegistrations(tahunBerjalan) {
        return await supabase
            .from('pendaftaran_cabor')
            .select('*')
            .eq('tahun_event', tahunBerjalan)
            .order('waktu_pendaftaran', { ascending: false });
    },

    // --- VOTING WARGA ---
    async submitVote(korlap, kategoriVote, tahunBerjalan) {
        return await supabase
            .from('voting_warga')
            .insert([
                {
                    korlap_pilihan: korlap,
                    kategori_vote: kategoriVote,
                    tahun_event: tahunBerjalan
                }
            ]);
    },

    async getVotes(tahunBerjalan) {
        return await supabase
            .from('voting_warga')
            .select('korlap_pilihan')
            .eq('tahun_event', tahunBerjalan);
    }
};
