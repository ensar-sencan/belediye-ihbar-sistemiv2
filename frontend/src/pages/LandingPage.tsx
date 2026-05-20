import { useNavigate } from 'react-router-dom';
import { MapPin, MessageSquare, TrendingUp, Shield, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Belediye İhbar Sistemi
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Mahallenizdeki sorunları kolayca bildirin, takip edin ve çözüm sürecinin parçası olun.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('/register')} className="btn-primary text-lg px-8 py-4">
              Hemen Başla <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/login')} className="btn-secondary text-lg px-8 py-4">
              Giriş Yap
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: MapPin,
              title: 'Konum Bazlı İhbar',
              desc: 'Harita üzerinden sorunu işaretleyin, belediye ekipleri hemen görsün',
              color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            },
            {
              icon: Clock,
              title: 'Anlık Takip',
              desc: 'İhbarınızın durumunu gerçek zamanlı olarak takip edin',
              color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
            },
            {
              icon: MessageSquare,
              title: 'İletişim',
              desc: 'Yorum yapın, oy verin ve toplulukla etkileşime geçin',
              color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            },
            {
              icon: TrendingUp,
              title: 'İstatistikler',
              desc: 'Bölgenizdeki sorunları ve çözüm oranlarını görün',
              color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
            },
            {
              icon: Shield,
              title: 'Güvenli',
              desc: 'Verileriniz güvende, kimliğiniz korunur',
              color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            },
            {
              icon: Users,
              title: 'Topluluk',
              desc: 'Komşularınızla birlikte daha yaşanabilir bir mahalle',
              color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }
          ].map((feature, i) => (
            <div key={i} className="card hover:shadow-lg transition-all group">
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 card bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Aktif Kullanıcı', value: '1,200+' },
              { label: 'Çözülen İhbar', value: '3,450+' },
              { label: 'Ortalama Çözüm', value: '2.5 gün' },
              { label: 'Memnuniyet', value: '%94' }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-indigo-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Nasıl Çalışır?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Kayıt Ol', desc: 'Ücretsiz hesap oluştur' },
              { step: '2', title: 'İhbar Et', desc: 'Sorunu fotoğrafla ve konumla bildir' },
              { step: '3', title: 'Takip Et', desc: 'Belediye ekipleri harekete geçer' },
              { step: '4', title: 'Çözüldü', desc: 'Sorun çözülür, bildirim alırsın' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center card bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Mahallenizi Daha İyi Bir Yer Yapın
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            Binlerce vatandaş gibi siz de sorunları bildirerek çözüm sürecinin bir parçası olun.
          </p>
          <button onClick={() => navigate('/register')} className="btn-primary text-lg px-8 py-4">
            Ücretsiz Kayıt Ol <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600 dark:text-slate-400">
          <p>© 2026 Belediye İhbar Sistemi. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
