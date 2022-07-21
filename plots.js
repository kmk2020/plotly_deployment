//Generate Dropdown Menu Items: ID numbers.
function init() {
  var selector = d3.select('#selDataset');

  d3.json('samples.json').then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append('option').text(sample).property('value', sample);
    });
    var initialSample = sampleNames[0];
    buildMetadata(initialSample);
    buildCharts(initialSample);
  });
}

init();

// optionChanged is called when a change takes place in this tag in the HTML. 
// this.value = newSample = ID number

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Print information to the "Demographic Info" once a user selects an ID number.
function buildMetadata(sample) {
  d3.json('samples.json').then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var pairs = Object.entries(resultArray[0]);
    var PANEL = d3.select('#sample-metadata');

    PANEL.html('');
    var results = pairs.forEach(function (pair) {
      PANEL.append('h6').text(pair[0] + ': ' + pair[1]);
    });
  });
}

//Build the charts once a user selects an ID number.
function buildCharts(sample) {
  d3.json('samples.json').then(function ({ samples, metadata }) {
    var data = samples.filter((obj) => obj.id == sample)[0];
    console.log(data);

    // Bar chart data
    var otuIDS = data.otu_ids.map((row) => `OTU ID: ${row}`);
    var sampleValues = data.sample_values.slice(0, 10);
    var sampleLabels = data.otu_labels.map((label) =>
      label.replace(/\;/g, ', ')
    );

    // Bubble chart data
    var otuID = data.otu_ids;
    var sampleValue = data.sample_values;
    var sampleLabel = data.otu_labels.map((label) =>
      label.replace(/\;/g, ', ')
    );

    // Guage data
    var metData = metadata.filter((obj) => obj.id == sample)[0];
    var washFreq = metData.wfreq;

    // Bar chart data
    var data1 = [
      {
        x: sampleValues,
        y: otuIDS,
        type: 'bar',
        orientation: 'h',
        text: sampleLabels,
        hoverinfo: 'text',
      },
    ];

    // Bubble chart data
    var data2 = [
      {
        x: otuID,
        y: sampleValue,
        mode: 'markers',
        text: sampleLabel,
        marker: {
          size: sampleValue,
          color: otuID,
        },
      },
    ];
    // Guage chart data
    var data3 = [
      {
        // domain: washFreq,
        value: washFreq,
        title: {
          text: 'Belly Button Washing Frequency<br>Scrubs per Week',
        },
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
          axis: { range: [null, 10] },
        },
      },
    ];

    // Bar chart layout
    var layout1 = {
      margin: {
        t: 40,
        l: 150,
      },
      title: {
        text: 'Top 10 Bacterial Species (OTUs)',
      },
    };

    // Bubble chart layout
    var layout2 = {
      xaxis: { title: 'OTU ID' },
    };

    // Gauge chart layout
    var layout3 = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 0 },
    };

    Plotly.newPlot('bar', data1, layout1);
    Plotly.newPlot('bubble', data2, layout2);
    Plotly.newPlot('gauge', data3, layout3);
  });
}