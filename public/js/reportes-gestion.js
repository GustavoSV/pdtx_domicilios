document.addEventListener("DOMContentLoaded", () => {
  const mesSelect = document.getElementById("mes-select");
  const anioInput = document.getElementById("anio-input");

  let barChartInstance = null;
  let donutChartInstance = null;

  let currentMes = null;
  let currentAnio = null;

  // Función para cargar datos y renderizar gráficas
  async function cargarDatos(mes, anio) {
    if (!mes || !anio) {
      alert("Por favor, selecciona un mes y un año válidos.");
      return;
    }

    try {
      // Obtener datos del backend
      const resDomUsu = await fetch(
        `/api/reportes/domicilios-por-usuario?mes=${mes}&anio=${anio}`
      );
      if (!resDomUsu.ok) {
        throw new Error(
          "Error al cargar los datos del reporte. Leyendo /api/reportes/domicilios-por-usuario"
        );
      }
      const domiciliosData = await resDomUsu.json();

      const resVlrsCC = await fetch(
        `/api/reportes/valores-por-centros-costos?mes=${mes}&anio=${anio}`
      );
      if (!resVlrsCC.ok) {
        throw new Error(
          "Error al cargar los datos del reporte. Leyendo /api/reportes/valores-por-centros-costos"
        );
      }
      const valoresCC = await resVlrsCC.json();

      // Si ya existe una gráfica, destruirla
      if (barChartInstance) {
        barChartInstance.destroy();
      }
      if (donutChartInstance) {
        donutChartInstance.destroy();
      }

      // Renderizar gráficas
      renderBarChart(domiciliosData);
      renderDonutChart(valoresCC);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      alert("Ocurrió un error al generar el reporte.");
    }
  }

  // Evento onchange para el selector de mes
  mesSelect.addEventListener("change", () => {
    currentMes = parseInt(mesSelect.value, 10);
    if (currentMes && currentAnio) {
      cargarDatos(currentMes, currentAnio);
    }
  });

  // Evento onchange para el input de año
  anioInput.addEventListener("change", () => {
    currentAnio = parseInt(anioInput.value, 10);
    if (currentMes && currentAnio) {
      cargarDatos(currentMes, currentAnio);
    }
  });

  // Función para renderizar la gráfica donut
  function renderDonutChart(data) {
    const options = {
      chart: { type: "donut" },
      series: data.map((item) => parseFloat(item.valorTotal)),
      labels: data.map((item) => item.nombre),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: "bottom" },
          },
        },
      ],
    };

    const donutChartInstance = new ApexCharts(
      document.querySelector("#chart-donut"),
      options
    );
    donutChartInstance.render();
  }

  // Función para renderizar la gráfica de barras
  function renderBarChart(data) {
    const options = {
      chart: { type: "bar" },
      plotOptions: { bar: { horizontal: false } },
      dataLabels: { enabled: false },
      xaxis: { categories: data.map((item) => item.nombre) },
      series: [
        {
          name: "Valor Acumulado",
          data: data.map((item) => parseFloat(item.valorTotal)),
        },
      ],
      // title: { text: 'Valores Acumulados por Centro de Costos' },
    };

    const barChartInstance = new ApexCharts(
      document.querySelector("#chart-bars"),
      options
    );
    barChartInstance.render();
  }
});
