const barChart = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: '2024-es F1-es szezon egyéni eredményei',
    data: {url: 'data/f1_2024_drivers.json'},
    mark: 'bar',
    encoding: {
        x: {field: 'driver', type: 'nominal', sort: '-y', title: 'Versenyző'},
        y: {field: 'points', type: 'quantitative', title: 'Pontok'}
    },
    autosize: {type: 'fit', contains: 'padding'},
    width: 'container',
    height: 400
};
vegaEmbed('#chart1', barChart);

const lineChart = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: 'Bahreini Nagydíj - Köridők versenyzőnként',
    data: {url: 'data/bahrein.json'},
    params: [
        {
            name: 'selectedDriver',
            select: {type: 'point', fields: ['versenyzo']},
            bind: 'legend'
        },
        {
            name: 'grid',
            select: 'interval',
            bind: 'scales'
        }
    ],
    mark: {type: 'line', strokeWidth: 2, point: {size: 30}},
    encoding: {
        x: {
            field: 'kor',
            type: 'quantitative',
            title: 'Kör',
            axis: {tickMinStep: 1}
        },
        y: {
            field: 'korido',
            type: 'quantitative',
            title: 'Köridő (másodperc)',
            scale: {zero: false}
        },
        color: {
            field: 'versenyzo',
            type: 'nominal',
            title: 'Versenyző'
        },
        opacity: {
            condition: {param: 'selectedDriver', value: 1},
            value: 0.2
        },
        tooltip: [
            {field: 'versenyzo', type: 'nominal', title: 'Versenyző'},
            {field: 'csapat', type: 'nominal', title: 'Csapat'},
            {field: 'kor', type: 'quantitative', title: 'Kör'},
            {field: 'korido', type: 'quantitative', title: 'Köridő (s)', format: '.3f'},
            {field: 'boxkiallas', type: 'nominal', title: 'Boxkiállás'}
        ]
    },
    autosize: {type: 'fit', contains: 'padding'},
    width: 'container',
    height: 400
};
vegaEmbed('#chart2', lineChart);

const dotChart = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: 'Sergio Perez időmérős eredményei',
    data: {url: 'data/perez_kvali.json'},
    transform: [
        {
            window: [{op: 'row_number', as: 'race_order'}]
        }
    ],
    mark: {type: 'circle', size: 100, filled: true},
    encoding: {
        x: {
            field: 'verseny',
            type: 'nominal',
            title: 'Verseny',
            axis: {labelAngle: -45},
            sort: {'field': 'race_order', 'order': 'ascending'}
        },
        y: {
            field: 'helyezes',
            type: 'quantitative',
            title: 'Helyezés',
            scale: {reverse: true, domain: [1, 10]},
            axis: {tickCount: 10}
        },
        tooltip: [
            {field: 'verseny', type: 'nominal', title: 'Verseny'},
            {field: 'helyezes', type: 'quantitative', title: 'Helyezés'}
        ]
    },
    
    autosize: {type: 'fit', contains: 'padding'},
    width: 'container',
    height: 400
};
vegaEmbed('#chart3', dotChart);

const elenKorokChart = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: '2024-es F1-es szezon - Élen töltött körök versenyzőnként',
    data: {
        url: 'data/elkorok.json',
        format: {property: 'statisztika'}
    },
    mark: 'bar',
    encoding: {
        y: {
            field: 'versenyzo',
            type: 'nominal',
            title: 'Versenyző',
            sort: {'field': 'elen_toltott_korok', 'order': 'descending'}
        },
        x: {
            field: 'elen_toltott_korok',
            type: 'quantitative',
            title: 'Élen töltött körök'
        },
        color: {
            field: 'csapat',
            type: 'nominal',
            title: 'Csapat'
        },
        tooltip: [
            {field: 'versenyzo', type: 'nominal', title: 'Versenyző'},
            {field: 'csapat', type: 'nominal', title: 'Csapat'},
            {field: 'elen_toltott_korok', type: 'quantitative', title: 'Élen töltött körök'},
            {field: 'szazalekos_arany', type: 'nominal', title: 'Százalékos arány'}
        ]
    },
    autosize: {type: 'fit', contains: 'padding'},
    width: 'container',
    height: 400
};
vegaEmbed('#chart4', elenKorokChart);

const head2headChart = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: '2024-es F1-es szezon - Csapattársak egymás elleni teljesítménye',
    data: {
        url: 'data/head2head.json',
        format: {property: 'csapatok_statisztikai'}
    },
    transform: [
        {
            calculate: "split(datum.idomero_parharc, ' - ')[0]",
            as: 'idomero_elso'
        },
        {
            calculate: "split(datum.idomero_parharc, ' - ')[1]",
            as: 'idomero_masodik'
        },
        {
            calculate: "split(datum.futam_parharc, ' - ')[0]",
            as: 'futam_elso'
        },
        {
            calculate: "split(datum.futam_parharc, ' - ')[1]",
            as: 'futam_masodik'
        },
        {
            calculate: "datum.versenyzok[0]",
            as: 'versenyzo_elso'
        },
        {
            calculate: "datum.versenyzok[1]",
            as: 'versenyzo_masodik'
        },
        {
            fold: ['idomero_elso', 'idomero_masodik', 'futam_elso', 'futam_masodik'],
            as: ['tipus', 'ertek']
        },
        {
            calculate: "indexof(['idomero_elso', 'idomero_masodik', 'futam_elso', 'futam_masodik'], datum.tipus) < 2 ? 'Időmérő' : 'Futam'",
            as: 'verseny_tipus'
        },
        {
            calculate: "indexof(['idomero_elso', 'idomero_masodik', 'futam_elso', 'futam_masodik'], datum.tipus) % 2 === 0 ? datum.versenyzo_elso : datum.versenyzo_masodik",
            as: 'versenyzo'
        },
        {
            calculate: "indexof(['idomero_elso', 'idomero_masodik', 'futam_elso', 'futam_masodik'], datum.tipus) % 2 === 0 ? parseInt(datum.ertek) : -parseInt(datum.ertek)",
            as: 'gyozelem_szam'
        },
        {
            calculate: "indexof(['idomero_elso', 'idomero_masodik', 'futam_elso', 'futam_masodik'], datum.tipus) % 2 === 0 ? 'Első versenyző' : 'Második versenyző'",
            as: 'versenyzo_pozicio'
        }
    ],
    mark: {type: 'bar', stroke: 'white', strokeWidth: 1},
    encoding: {
        y: {
            field: 'csapat',
            type: 'nominal',
            title: 'Csapat',
            sort: null,
            axis: {titleFontSize: 14, labelFontSize: 11}
        },
        x: {
            field: 'gyozelem_szam',
            type: 'quantitative',
            title: 'Győzelem száma',
            axis: {
                values: [-25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25],
                titleFontSize: 14,
                labelFontSize: 11
            }
        },
        color: {
            field: 'versenyzo_pozicio',
            type: 'nominal',
            title: 'Versenyző',
            scale: {
                domain: ['Első versenyző', 'Második versenyző'],
                range: ['#667eea', '#764ba2']
            },
            legend: {
                titleFontSize: 14,
                labelFontSize: 12
            }
        },
        column: {
            field: 'verseny_tipus',
            type: 'nominal',
            title: null,
            sort: ['Időmérő', 'Futam'],
            header: {
                titleFontSize: 14,
                labelFontSize: 12
            }
        },
        tooltip: [
            {field: 'csapat', type: 'nominal', title: 'Csapat'},
            {field: 'versenyzo', type: 'nominal', title: 'Versenyző'},
            {field: 'verseny_tipus', type: 'nominal', title: 'Típus'},
            {
                field: 'gyozelem_szam',
                type: 'quantitative',
                title: 'Győzelem',
                format: 'd'
            }
        ]
    },
    autosize: {type: 'fit', contains: 'padding'},
    width: 'container',
    height: 500,
    config: {
        view: {stroke: 'transparent'},
        axis: {domainColor: '#ddd', gridColor: '#f0f0f0'}
    }
};
vegaEmbed('#chart5', head2headChart);

const qualivsraceChart = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: '2024-es F1-es szezon - Rajt vs Cél pozíció változása',
    data: {
        url: 'data/qvalivsrace.json',
        format: {type: 'json', property: 'adatok'}
    },
    mark: 'bar',
    encoding: {
        y: {
            field: 'versenyzo',
            type: 'nominal',
            title: 'Versenyző',
            sort: {'field': 'valtozas_osszesen', 'order': 'ascending'}
        },
        x: {
            field: 'valtozas_osszesen',
            type: 'quantitative',
            title: 'Nettó pozícióváltozás',
            scale: {domain: [-45, 45]}
        },
        color: {
            field: 'kategoria',
            type: 'nominal',
            title: 'Kategória',
            scale: {
                domain: ['Felzárkózó', 'Stabil', 'Visszaeső'],
                range: ['#2E7D32', '#757575', '#C62828']
            }
        },
        tooltip: [
            {field: 'versenyzo', type: 'nominal', title: 'Versenyző'},
            {field: 'csapat', type: 'nominal', title: 'Csapat'},
            {field: 'valtozas_osszesen', type: 'quantitative', title: 'Változás összesen'},
            {field: 'atlagos_valtozas', type: 'quantitative', title: 'Átlagos változás', format: '.1f'},
            {field: 'kategoria', type: 'nominal', title: 'Kategória'}
        ]
    },
    autosize: {type: 'fit', contains: 'padding'},
    width: 'container',
    height: 600
};
vegaEmbed('#chart6', qualivsraceChart).catch(err => {
    console.error('Chart6 error:', err);
});

