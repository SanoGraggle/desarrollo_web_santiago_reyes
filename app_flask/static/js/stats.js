
fetch('/api/estadisticas')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.error) {
                console.error('API error', data.error);
                return;
            }
        
            //primer grafico
            var by_day = data.by_day || [];
            var categories = by_day.map(function (r) { return r.date; });
            var seriesData = by_day.map(function (r) { return r.count; });

            Highcharts.chart('chart-line', {
                title: { text: 'Avisos por día' },
                xAxis: { categories: categories },
                yAxis: { title: { text: 'Cantidad de avisos' } },
                series: [{ name: 'Avisos', data: seriesData }]
            });

            //segundo grafico
            var by_type = data.by_type || [];
            var pieData = by_type.map(function (r) { return { name: r.tipo, y: r.count }; });

            Highcharts.chart('chart-pie', {
                chart: { type: 'pie' },
                title: { text: 'Avisos por tipo (gato vs perro)' },
                series: [{ name: 'Avisos', colorByPoint: true, data: pieData }]
            });

            // tercer grafio
            var by_month = data.by_month_type || [];
            var months = by_month.map(function (r) { return r.month; });
            var gatos = by_month.map(function (r) { return r.gato || 0; });
            var perros = by_month.map(function (r) { return r.perro || 0; });

            Highcharts.chart('chart-bars', {
                chart: { type: 'column' },
                title: { text: 'Avisos por mes y tipo' },
                xAxis: { categories: months },
                yAxis: { title: { text: 'Cantidad' } },
                series: [
                    { name: 'Gatos', data: gatos },
                    { name: 'Perros', data: perros }
                ]
            });
        })
        .catch(function (err) {
            console.error('Fetch error', err);
        });
