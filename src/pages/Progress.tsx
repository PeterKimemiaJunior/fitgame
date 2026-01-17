import { useMemo } from "react";
import { SimpleLineChart } from "../components/ui/Charts";
import { useV4Store } from "../store/useV4Store";
import { calculateStreak } from "../domain/gamification/streak";
import { checkAchievements } from "../domain/gamification/achievements";

export function Progress() {
  const { dailyProgress } = useV4Store();

  // 1. Streaks
  const streak = useMemo(() => calculateStreak(dailyProgress), [dailyProgress]);

  // 2. Conquistas
  const achievements = useMemo(
    () => checkAchievements(dailyProgress),
    [dailyProgress]
  );
  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  // 3. Stats Semanais
  const summary = useMemo(() => {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    let activityDone = 0;
    let nutritionDone = 0;
    let daysWithAnyData = 0;
    let totalXP = 0;

    days.forEach((date) => {
      const dayData = dailyProgress[date];
      if (dayData) {
        daysWithAnyData++;
        if (dayData.activityDone) {
          activityDone++;
          totalXP += 10;
        }
        if (dayData.nutritionDone) {
          nutritionDone++;
          totalXP += 10;
        }
      }
    });

    const totalPossible = daysWithAnyData * 2;
    const adherenceRate =
      totalPossible > 0
        ? Math.round(((activityDone + nutritionDone) / totalPossible) * 100)
        : 0;

    return {
      adherenceRate,
      totalDays: daysWithAnyData,
      totalXP,
    };
  }, [dailyProgress]);

  // 4. Dados do Gráfico de XP (Existente)
  const xpChartData = useMemo(() => {
    const dataPoints: number[] = [];
    const labels: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const dayData = dailyProgress[dateKey];

      labels.push(
        new Date(d).toLocaleDateString("pt-BR", { weekday: "narrow" })
      );

      let dayPoints = 0;
      if (dayData) {
        if (dayData.activityDone) dayPoints += 10;
        if (dayData.nutritionDone) dayPoints += 10;
      }
      dataPoints.push(dayPoints);
    }

    return { labels, data: dataPoints };
  }, [dailyProgress]);

  // 5. Dados do Gráfico de Peso (NOVO)
  const weightChartData = useMemo(() => {
    const dataPoints: (number | null)[] = [];
    const labels: string[] = [];

    // Pegamos os últimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const dayData = dailyProgress[dateKey];

      labels.push(
        new Date(d).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        })
      );

      // Se tiver peso, usa. Se não, usa null (quebra a linha no gráfico)
      dataPoints.push(dayData?.weightLogged ? dayData.weightLogged : null);
    }

    return { labels, data: dataPoints };
  }, [dailyProgress]);

  return (
    <div className="p-6 space-y-6 pb-20">
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Seu Progresso</h1>
        <p className="text-sm text-gray-500">
          Evolução da sua saúde e consistência.
        </p>
      </header>

      {/* 1. STREAK PRINCIPAL (Gamificação) */}
      <section className="bg-gradient-to-r from-orange-50 to-white border border-orange-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Sequência Atual
          </h2>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-black text-orange-700">
              {streak.current}
            </span>
            <span className="text-lg font-bold text-orange-400">dias</span>
          </div>
        </div>
        {/* Ícone de Fogo condicional */}
        <div
          className={`text-5xl transition-transform duration-500 ${
            streak.current >= 3 ? "animate-bounce" : "grayscale opacity-50"
          }`}
        >
          🔥
        </div>
      </section>

      {/* 2. GRÁFICO DE PESO (NOVO - Foco em Saúde) */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Evolução do Peso
          </h2>
          <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
            7 dias
          </span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm min-h-[160px] flex items-center justify-center">
          {/* Se tiver dados de peso, mostra gráfico. Se não, mostra placeholder */}
          {weightChartData.data.some((val) => val !== null) ? (
            <SimpleLineChart
              labels={weightChartData.labels}
              data={weightChartData.data}
              color="#8b5cf6"
            />
          ) : (
            <div className="text-center p-6 text-gray-400">
              <p className="text-xs font-medium">
                Registre seu peso diário em "Hoje" para ver o gráfico.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. GRÁFICO DE XP (Existente - Foco em Gamificação) */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Produtividade Diária (XP)
          </h2>
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
            7 dias
          </span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
          <SimpleLineChart
            labels={xpChartData.labels}
            data={xpChartData.data}
            color="#10b981"
          />
        </div>
      </section>

      {/* 4. RESUMO NUMÉRICO */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          Resumo da Semana
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
              Dias Ativos
            </p>
            <p className="text-2xl font-black text-gray-800">
              {summary.totalDays}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
              XP Total
            </p>
            <p className="text-2xl font-black text-gray-800">
              {summary.totalXP}
            </p>
          </div>
        </div>
      </section>

      {/* 5. CONQUISTAS */}
      {unlockedAchievements.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Conquistas Desbloqueadas
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {/* ... dentro do map em Progress.tsx ... */}

            {/* Substitua o <span> de emoji pelo componente <Icon /> */}
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  ach.unlocked
                    ? "bg-white border-yellow-200 shadow-sm"
                    : "bg-gray-50 border-gray-100 opacity-40"
                }`}
              >
                {/* TROCAR AQUI: */}
                {/* <span className="text-2xl filter drop-shadow-sm">{ach.unlocked ? ach.icon : '🔒'}</span> */}

                {/* POR ISTO: */}
                <div
                  className={`text-2xl ${
                    ach.unlocked ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  {/* Mapeamento simples de chaves para ícones SVG */}
                  {ach.iconKey === "seed" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c0-1.052-.18-2.062-.512-3a8.987 8.987 0 00-3 2.292m0 14.25a8.987 8.987 0 01-6-2.292c0-1.052.18-2.062.512-3a8.966 8.966 0 013-2.292m0 14.25a8.966 8.966 0 006-2.292c0-1.052.18-2.062.512-3a8.987 8.987 0 013-2.292m-6 2.292a8.987 8.987 0 01-6-2.292c0-1.052.18-2.062.512-3a8.966 8.966 0 013-2.292m6 0a8.966 8.966 0 013 2.292m-3-2.292a8.987 8.987 0 016-2.292m-6 2.292c0-1.052.18-2.062.512-3a8.966 8.966 0 013-2.292"
                      />
                    </svg>
                  )}
                  {ach.iconKey === "shield" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  {ach.iconKey === "fire" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z"
                      />
                    </svg>
                  )}
                </div>

                {/* Se estiver trancado, usa um ícone genérico de cadeado */}
                {!ach.unlocked && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                )}

                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-800">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-tight">
                    {ach.description}
                  </p>
                </div>
                {ach.unlocked && (
                  <div className="text-yellow-500 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-full">
                    NOVO
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
