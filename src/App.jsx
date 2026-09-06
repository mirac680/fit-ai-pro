import { Activity, ActivitySquare, Bookmark, Calculator, CalendarDays, Clock, Droplet, Dumbbell, Flame, Globe, MapPin, Moon, Star, Sun, Target, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

function App() {
  // --- LOCALSTORAGE BAŞLANGIÇ AYARLARI ---
  // Uygulama açıldığında verileri tarayıcı hafızasından (localStorage) çekeriz.
  const [theme, setTheme] = useState(() => localStorage.getItem('fitai_theme') || 'dark');
  const [lang, setLang] = useState(() => localStorage.getItem('fitai_lang') || 'tr');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const defaultFormData = {
    gender: 'male', age: '', weight: '', height: '',
    activityLevel: '1.55', goal: 'maintain', experience: 'beginner',
    daysPerWeek: '4', workoutTime: '60', location: 'gym', focusMuscle: 'none'
  };

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('fitai_formData');
    return savedData ? JSON.parse(savedData) : defaultFormData;
  });

  const [results, setResults] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);

  const [favoriteData, setFavoriteData] = useState(() => {
    const savedFav = localStorage.getItem('fitai_favorite');
    return savedFav ? JSON.parse(savedFav) : null;
  });

  // Veriler her değiştiğinde LocalStorage'a otomatik kaydeder (Veri Kalıcılığı)
  useEffect(() => { localStorage.setItem('fitai_formData', JSON.stringify(formData)); }, [formData]);
  useEffect(() => { localStorage.setItem('fitai_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('fitai_lang', lang); }, [lang]);
  useEffect(() => {
    if (favoriteData) localStorage.setItem('fitai_favorite', JSON.stringify(favoriteData));
    else localStorage.removeItem('fitai_favorite');
  }, [favoriteData]);

  // --- KUSURSUZ ÇEVİRİ SÖZLÜĞÜ ---
  const t = {
    tr: {
      appTitle: "FitAI Pro", title: "Kişisel Antrenörün", subtitle: "Zamanına, hedefine ve ekipmanına göre yapay zeka destekli profesyonel plan.",
      profile: "Fiziksel Profilin", calcBtn: "Analiz Et & Planla", wait: "Veriler Bekleniyor", waitSub: "Programını oluşturmak için formu doldur.",
      water: "Günlük Su", time: "Antrenman Süresi", location: "Çalışma Alanı", focus: "Öncelikli Bölge",
      gender: "Cinsiyet", male: "Erkek", female: "Kadın", age: "Yaş", height: "Boy (cm)", weight: "Kilo (kg)",
      goal: "Hedefin Ne?", goalLose: "Yağ Yak (Definisyon)", goalMaintain: "Form Koru (Recomp)", goalGain: "Kas Ekle (Bulking)",
      activityTitle: "Hareket Seviyesi", act1: "Masa başı (Hareketsiz)", act2: "Hafif Aktif", act3: "Orta Aktif", act4: "Çok Aktif",
      daysTitle: "Haftalık Gün", dayStr: "Gün", time30: "30 Dakika", time45: "45 Dakika", time60: "1 Saat", time90: "1.5 Saat",
      gym: "Spor Salonu", home: "Ev (Temel Alet)", focusNone: "Dengeli (Full Vücut)", chest: "Göğüs", arms: "Kollar", legs: "Bacak",
      report: "Fiziksel Analiz Raporu", bmi: "Vücut Kitle İndeksi", cal: "Kalori", pro: "Protein", carb: "Karb", fat: "Yağ",
      planTitle: "Sana Özel Antrenman Protokolü", rest: "Dinlenme Günü", restDesc: "Kas onarımı için dinlen.",
      howTo: "Nasıl Yapılır?", coachTip: "Antrenör Notu", close: "Kapat", saveFav: "Programı Kaydet", loadFav: "Kayıtlı Programı Aç", delFav: "Sil",
      types: { FullBody: "Tüm Vücut", Upper: "Üst Vücut", Lower: "Alt Vücut", Push: "İtiş (Push)", Pull: "Çekiş (Pull)", Legs: "Bacak (Legs)" },
      bmiStatus: { under: "Zayıf", normal: "Normal", over: "Kilolu", obese: "Obezite" }
    },
    en: {
      appTitle: "FitAI Pro", title: "Your Personal PT", subtitle: "AI-powered professional plan based on your time, goals, and equipment.",
      profile: "Physical Profile", calcBtn: "Analyze & Generate", wait: "Awaiting Data", waitSub: "Fill the form to create your custom routine.",
      water: "Daily Water", time: "Duration", location: "Location", focus: "Focus Muscle",
      gender: "Gender", male: "Male", female: "Female", age: "Age", height: "Height (cm)", weight: "Weight (kg)",
      goal: "Your Goal?", goalLose: "Lose Fat (Cut)", goalMaintain: "Maintain (Recomp)", goalGain: "Build Muscle (Bulk)",
      activityTitle: "Activity Level", act1: "Sedentary", act2: "Lightly Active", act3: "Moderately Active", act4: "Very Active",
      daysTitle: "Days/Week", dayStr: "Day", time30: "30 Mins", time45: "45 Mins", time60: "1 Hour", time90: "1.5 Hours",
      gym: "Gym", home: "Home", focusNone: "Balanced", chest: "Chest", arms: "Arms", legs: "Legs",
      report: "Physical Analysis Report", bmi: "Body Mass Index", cal: "Calories", pro: "Protein", carb: "Carbs", fat: "Fats",
      planTitle: "Custom Workout Protocol", rest: "Rest Day", restDesc: "Rest for muscle recovery.",
      howTo: "How to perform?", coachTip: "Coach's Tip", close: "Close", saveFav: "Save Routine", loadFav: "Load Saved Routine", delFav: "Delete",
      types: { FullBody: "Full Body", Upper: "Upper Body", Lower: "Lower Body", Push: "Push Day", Pull: "Pull Day", Legs: "Leg Day" },
      bmiStatus: { under: "Underweight", normal: "Normal", over: "Overweight", obese: "Obese" }
    }
  };
  const curr = t[lang];

  // Egzersiz Veritabanı
  const exerciseDB = {
    "Bench Press": { tr: { target: "Göğüs, Arka Kol", desc: "Barı omuz genişliğinde kavrayıp göğsünüze indirin ve itin." }, en: { target: "Chest, Triceps", desc: "Grip bar shoulder-width, lower to chest and press up." } },
    "Push-up": { tr: { target: "Göğüs, Triceps", desc: "Eller omuz genişliğinde, vücut düz çizgi halinde yere yaklaşıp kalkın." }, en: { target: "Chest, Triceps", desc: "Keep body straight, lower yourself and push back up." } },
    "Squat": { tr: { target: "Ön Bacak, Kalça", desc: "Sırt dik, kalçayı geriye vererek çömelin." }, en: { target: "Quads, Glutes", desc: "Keep back straight, squat down pushing hips back." } },
    "Lat Pulldown": { tr: { target: "Sırt, Kanat", desc: "Geniş tutuşla barı kavrayıp üst göğsünüze çekin." }, en: { target: "Back, Lats", desc: "Pull the bar down to your upper chest with a wide grip." } },
    "Pull-up": { tr: { target: "Sırt, Biceps", desc: "Barfiks demirine asılıp çenenizi barın üstüne çekin." }, en: { target: "Back, Biceps", desc: "Pull yourself up until your chin clears the bar." } },
    "Deadlift": { tr: { target: "Arka Bacak, Bel", desc: "Barı bacaklara yakın tutarak kalça gücüyle kalkın." }, en: { target: "Hamstrings, Lower Back", desc: "Lift the bar keeping it close to your legs, driving with hips." } },
    "Overhead Press": { tr: { target: "Omuz", desc: "Barı köprücük kemiğinden baş üstüne doğru itin." }, en: { target: "Shoulders", desc: "Press the bar from your collarbone directly overhead." } },
    "Biceps Curl": { tr: { target: "Pazı (Biceps)", desc: "Dirsekleri sabitleyip ağırlığı omuzlara doğru kaldırın." }, en: { target: "Biceps", desc: "Keep elbows pinned and curl the weight up." } },
    "default": { tr: { target: "Genel Kas", desc: "Hareketi kontrollü yapın. Nefes kontrolüne dikkat edin." }, en: { target: "General", desc: "Perform with control. Remember to breathe properly." } }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(lang === 'tr' ? 'en' : 'tr');

  const handleSaveFavorite = () => {
    setFavoriteData({ results, workoutPlan, date: new Date().toLocaleDateString() });
  };
  const handleLoadFavorite = () => {
    if (favoriteData) { setResults(favoriteData.results); setWorkoutPlan(favoriteData.workoutPlan); }
  };

  const calculateAdvanced = (e) => {
    e.preventDefault();
    const { gender, age, weight, height, activityLevel, goal, daysPerWeek, workoutTime, location, focusMuscle } = formData;
    if (!weight || !height || !age) return;

    const w = parseFloat(weight); const h = parseFloat(height); const a = parseInt(age); const activity = parseFloat(activityLevel);

    const bmiVal = (w / ((h / 100) * (h / 100))).toFixed(1);
    let bmiCat = "normal";
    if (bmiVal < 18.5) bmiCat = "under"; else if (bmiVal > 25 && bmiVal <= 30) bmiCat = "over"; else if (bmiVal > 30) bmiCat = "obese";

    let bmr = gender === 'male' ? (10 * w) + (6.25 * h) - (5 * a) + 5 : (10 * w) + (6.25 * h) - (5 * a) - 161;
    let tdee = Math.round(bmr * activity + (goal === 'lose' ? -500 : goal === 'gain' ? 300 : 0));

    setResults({
      tdee, bmi: bmiVal, bmiCat,
      protein: Math.round(w * 2.2), fat: Math.round((tdee * 0.25) / 9),
      carbs: Math.round((tdee - (w * 2.2 * 4) - ((tdee * 0.25) / 9 * 9)) / 4),
      water: (w * 0.035 + (parseInt(workoutTime) / 60) * 0.5).toFixed(1)
    });

    generatePremiumRoutine(parseInt(daysPerWeek), parseInt(workoutTime), location, focusMuscle);
  };

  const generatePremiumRoutine = (days, time, location, focus) => {
    let exCount = time === 30 ? 3 : time === 45 ? 4 : time === 60 ? 5 : 7;
    const isHome = location === 'home';

    const pools = {
      FullBody: isHome ? ["Push-up", "Air Squat", "Dumbbell Row", "Overhead Press", "Plank", "Biceps Curl"] : ["Bench Press", "Squat", "Lat Pulldown", "Overhead Press", "Leg Press", "Biceps Curl"],
      Push: isHome ? ["Push-up", "Pike Push-up", "Dips", "Dumbbell Fly", "Lateral Raise"] : ["Bench Press", "Incline Press", "Overhead Press", "Cable Crossover", "Triceps Pushdown"],
      Pull: isHome ? ["Pull-up", "Dumbbell Row", "Biceps Curl", "Hammer Curl", "Superman"] : ["Lat Pulldown", "Barbell Row", "Face Pull", "Seated Cable Row", "Biceps Curl"],
      Legs: isHome ? ["Air Squat", "Lunges", "Glute Bridge", "Calf Raise", "Jump Squat"] : ["Squat", "Leg Press", "Deadlift", "Leg Curl", "Calf Raise"],
      Upper: isHome ? ["Push-up", "Dumbbell Row", "Dips", "Dumbbell Curl", "Lateral Raise"] : ["Bench Press", "Barbell Row", "Overhead Press", "Lat Pulldown", "Biceps Curl"],
      Lower: isHome ? ["Air Squat", "Lunges", "Glute Bridge", "Calf Raise", "Plank"] : ["Squat", "Leg Press", "Deadlift", "Leg Curl", "Calf Raise"]
    };

    const getExercises = (type) => {
      let selected = pools[type].slice(0, exCount);
      let setsInfo = time <= 30 ? "3 x 10" : time <= 45 ? "3 x 12" : "4 x 10";
      return selected.map(name => ({ name, sets: setsInfo, isFocus: false }));
    };

    let plan = [];
    if (days === 3) plan = [{ type: "FullBody" }, { isRest: true }, { type: "FullBody" }, { isRest: true }, { type: "FullBody" }, { isRest: true }, { isRest: true }];
    else if (days === 4) plan = [{ type: "Upper" }, { type: "Lower" }, { isRest: true }, { type: "Upper" }, { type: "Lower" }, { isRest: true }, { isRest: true }];
    else if (days === 5) plan = [{ type: "Push" }, { type: "Pull" }, { type: "Legs" }, { isRest: true }, { type: "Upper" }, { type: "Lower" }, { isRest: true }];
    else plan = [{ type: "Push" }, { type: "Pull" }, { type: "Legs" }, { type: "Push" }, { type: "Pull" }, { type: "Legs" }, { isRest: true }];

    const finalPlan = plan.map((dayObj, index) => {
      if (dayObj.isRest) return { day: index + 1, isRest: true };
      let exercises = getExercises(dayObj.type);
      if (focus === 'chest' && ['Push', 'Upper', 'FullBody'].includes(dayObj.type)) exercises.push({ name: "Dumbbell Fly", sets: "3 x 12", isFocus: true });
      if (focus === 'arms' && ['Push', 'Pull', 'Upper', 'FullBody'].includes(dayObj.type)) exercises.push({ name: "Biceps Curl", sets: "3 x 12", isFocus: true });
      if (focus === 'legs' && ['Legs', 'Lower', 'FullBody'].includes(dayObj.type)) exercises.push({ name: "Lunges", sets: "3 x 15", isFocus: true });
      return { day: index + 1, type: dayObj.type, exercises, isRest: false };
    });
    setWorkoutPlan(finalPlan);
  };

  const openExerciseInfo = (exName) => {
    const data = exerciseDB[exName] || exerciseDB["default"];
    setSelectedExercise({ name: exName, ...data[lang] });
  };

  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-800';
  const card = isDark ? 'bg-[#1e293b] border-slate-700/50 shadow-xl' : 'bg-white border-slate-200 shadow-xl';
  const inputBg = isDark ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900';

  return (
    <div className={`min-h-screen font-sans pb-16 transition-colors duration-300 ${bg}`}>
      <nav className={`flex justify-between items-center p-5 border-b ${isDark ? 'border-slate-800 bg-[#1e293b]/50' : 'border-slate-200 bg-white/50'} backdrop-blur-md sticky top-0 z-40`}>
        <div className="font-black text-2xl text-indigo-500 flex items-center gap-2"><ActivitySquare /> {curr.appTitle}</div>
        <div className="flex items-center gap-4">

          {/* Favori Yükleme Alanı */}
          {favoriteData && (
            <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <Star size={16} className="text-emerald-500 fill-emerald-500" />
              <button onClick={handleLoadFavorite} className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">{curr.loadFav}</button>
              <button onClick={() => setFavoriteData(null)} className="ml-2 text-red-500 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          )}

          <button onClick={toggleLang} className="flex items-center gap-1 font-bold hover:text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-full transition"><Globe size={18} /> {lang.toUpperCase()}</button>
          <button onClick={toggleTheme} className="hover:text-indigo-500 p-2 rounded-full hover:bg-slate-800/10">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
        </div>
      </nav>

      <div className={`pt-12 pb-16 px-6 text-center ${isDark ? 'bg-gradient-to-b from-indigo-900/20' : 'bg-gradient-to-b from-indigo-100/50'}`}>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 mb-4">{curr.title}</h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">{curr.subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* FORM */}
          <div className={`xl:col-span-4 rounded-3xl p-7 border ${card}`}>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><User className="text-indigo-500" /> {curr.profile}</h2>
            <form onSubmit={calculateAdvanced} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold opacity-70 mb-1.5">{curr.gender}</label><select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full rounded-xl p-3 outline-none ${inputBg}`}><option value="male">{curr.male}</option><option value="female">{curr.female}</option></select></div>
                <div><label className="block text-xs font-bold opacity-70 mb-1.5">{curr.age}</label><input type="number" name="age" value={formData.age} required onChange={handleInputChange} className={`w-full rounded-xl p-3 outline-none ${inputBg}`} /></div>
                <div><label className="block text-xs font-bold opacity-70 mb-1.5">{curr.height}</label><input type="number" name="height" value={formData.height} required onChange={handleInputChange} className={`w-full rounded-xl p-3 outline-none ${inputBg}`} /></div>
                <div><label className="block text-xs font-bold opacity-70 mb-1.5">{curr.weight}</label><input type="number" name="weight" value={formData.weight} required onChange={handleInputChange} className={`w-full rounded-xl p-3 outline-none ${inputBg}`} /></div>
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-500/20">
                <div><label className="block text-xs font-bold opacity-70 mb-1.5">{curr.goal}</label><select name="goal" value={formData.goal} onChange={handleInputChange} className={`w-full rounded-xl p-3 outline-none ${inputBg}`}><option value="maintain">{curr.goalMaintain}</option><option value="lose">{curr.goalLose}</option><option value="gain">{curr.goalGain}</option></select></div>
                <div><label className="block text-xs font-bold opacity-70 mb-1.5">{curr.activityTitle}</label><select name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} className={`w-full rounded-xl p-3 outline-none ${inputBg}`}><option value="1.2">{curr.act1}</option><option value="1.375">{curr.act2}</option><option value="1.55">{curr.act3}</option><option value="1.725">{curr.act4}</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-500/20">
                <div><label className="block text-xs font-bold opacity-70 mb-1.5 flex items-center gap-1"><MapPin size={12} /> {curr.location}</label><select name="location" value={formData.location} onChange={handleInputChange} className={`w-full rounded-xl p-3 outline-none ${inputBg}`}><option value="gym">{curr.gym}</option><option value="home">{curr.home}</option></select></div>
                <div><label className="block text-xs font-bold opacity-70 mb-1.5 flex items-center gap-1"><Clock size={12} /> {curr.time}</label><select name="workoutTime" value={formData.workoutTime} onChange={handleInputChange} className={`w-full rounded-xl p-3 outline-none ${inputBg}`}><option value="30">{curr.time30}</option><option value="45">{curr.time45}</option><option value="60">{curr.time60}</option><option value="90">{curr.time90}</option></select></div>
                <div><label className="block text-xs font-bold opacity-70 mb-1.5 flex items-center gap-1"><Target size={12} /> {curr.focus}</label><select name="focusMuscle" value={formData.focusMuscle} onChange={handleInputChange} className={`w-full rounded-xl p-3 outline-none ${inputBg}`}><option value="none">{curr.focusNone}</option><option value="chest">{curr.chest}</option><option value="arms">{curr.arms}</option><option value="legs">{curr.legs}</option></select></div>
                <div><label className="block text-xs font-bold opacity-70 mb-1.5 flex items-center gap-1"><CalendarDays size={12} /> {curr.daysTitle}</label><select name="daysPerWeek" value={formData.daysPerWeek} onChange={handleInputChange} className={`w-full rounded-xl p-3 outline-none ${inputBg}`}><option value="3">3 {curr.dayStr}</option><option value="4">4 {curr.dayStr}</option><option value="5">5 {curr.dayStr}</option><option value="6">6 {curr.dayStr}</option></select></div>
              </div>
              <button type="submit" className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2"><Calculator size={20} /> {curr.calcBtn}</button>
            </form>
          </div>

          {/* SONUÇLAR */}
          <div className="xl:col-span-8 space-y-6">
            {results ? (
              <div className={`border rounded-3xl p-7 ${card}`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black flex items-center gap-2"><Flame className="text-orange-500" /> {curr.report}</h3>
                  <button onClick={handleSaveFavorite} className="flex items-center gap-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 px-4 py-2 rounded-xl font-bold transition">
                    <Bookmark size={18} /> <span className="hidden md:inline">{curr.saveFav}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className={`col-span-2 md:col-span-2 p-5 rounded-2xl border-b-4 ${results.bmiCat === 'normal' ? 'border-b-emerald-500' : results.bmiCat === 'over' ? 'border-b-orange-500' : 'border-b-red-500'} ${inputBg}`}><div className="text-sm opacity-70 mb-1">{curr.bmi}</div><div className="text-3xl font-black">{results.bmi}</div><div className="text-xs font-bold mt-1 opacity-80">{curr.bmiStatus[results.bmiCat]}</div></div>
                  <div className={`p-5 rounded-2xl border-b-4 border-b-indigo-500 ${inputBg}`}><div className="text-sm opacity-70 mb-1">{curr.cal}</div><div className="text-2xl font-black">{results.tdee}</div></div>
                  <div className={`p-5 rounded-2xl border-b-4 border-b-blue-500 ${inputBg}`}><div className="text-sm opacity-70 mb-1">{curr.pro}</div><div className="text-2xl font-black">{results.protein}g</div></div>
                  <div className={`p-5 rounded-2xl border-b-4 border-b-yellow-500 ${inputBg}`}><div className="text-sm opacity-70 mb-1">{curr.carb}</div><div className="text-2xl font-black">{results.carbs}g</div></div>
                  <div className={`p-5 rounded-2xl border-b-4 border-b-cyan-500 ${inputBg}`}><div className="text-sm opacity-70 mb-1"><Droplet size={14} className="inline" /> Su</div><div className="text-2xl font-black">{results.water}L</div></div>
                </div>
              </div>
            ) : (
              <div className={`border border-dashed rounded-3xl p-12 text-center h-48 flex flex-col items-center justify-center ${card}`}><h3 className="text-xl font-bold opacity-80 mb-2">{curr.wait}</h3><p className="opacity-50 text-sm">{curr.waitSub}</p></div>
            )}

            {workoutPlan && (
              <div className={`border rounded-3xl p-7 ${card}`}>
                <h3 className="text-2xl font-black mb-6 flex items-center gap-2"><Dumbbell className="text-emerald-500" /> {curr.planTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {workoutPlan.map((item, index) => (
                    <div key={index} className={`p-5 rounded-2xl border transition-all ${inputBg} ${item.isRest ? 'opacity-70' : 'hover:border-indigo-500/50 hover:shadow-lg'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className={`text-xs font-black px-3 py-1.5 rounded-lg ${item.isRest ? 'bg-slate-500/20 text-slate-400' : 'bg-indigo-500/20 text-indigo-500'}`}>{curr.dayStr} {item.day}</span>
                      </div>
                      <h4 className="font-bold text-lg mb-4">{item.isRest ? curr.rest : curr.types[item.type]}</h4>
                      {item.isRest ? (<p className="text-sm opacity-60 flex items-center gap-2"><Moon size={16} /> {curr.restDesc}</p>) : (
                        <ul className="space-y-3">
                          {item.exercises.map((ex, idx) => (
                            <li key={idx} onClick={() => openExerciseInfo(ex.name)} className="flex items-center justify-between p-3 bg-slate-500/5 rounded-xl hover:bg-indigo-500/10 cursor-pointer group transition">
                              <div className="flex flex-col"><span className={`font-semibold text-sm ${ex.isFocus ? 'text-orange-400' : ''}`}>{ex.name}</span>{ex.isFocus && <span className="text-[10px] text-orange-500/80 uppercase mt-0.5">Focus Muscle</span>}</div>
                              <span className="text-xs font-bold bg-slate-500/20 px-2 py-1 rounded-md text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/20 transition">{ex.sets}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedExercise && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-3xl p-7 relative shadow-2xl border ${card}`}>
            <button onClick={() => setSelectedExercise(null)} className="absolute top-5 right-5 p-2 rounded-full bg-slate-500/10 hover:bg-red-500/20 text-red-500 transition"><X size={20} /></button>
            <h3 className="text-3xl font-black text-indigo-500 mb-2">{selectedExercise.name}</h3>
            <span className="text-xs font-bold px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg inline-flex items-center gap-1"><Target size={14} /> {selectedExercise.target}</span>
            <div className="w-full h-40 bg-slate-800/50 rounded-2xl mt-6 mb-6 flex flex-col items-center justify-center border border-dashed border-slate-500/30">
              <Activity size={32} className="text-slate-500 mb-2 opacity-50" />
              <span className="text-sm font-semibold opacity-50">Video Alanı</span>
            </div>
            <h4 className="font-bold text-lg mb-2">{curr.howTo}</h4>
            <p className="text-sm opacity-80 mb-5 leading-relaxed">{selectedExercise.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;