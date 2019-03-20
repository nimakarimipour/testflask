function buildMetadata(sample) {
  d3.json("/metadata/" + sample).then(infos => {
    panel_body = document.getElementById("sample-metadata");
    panel_body.innerHTML = "";
    append(panel_body, "<p>Age: " + infos.AGE + "</p>");
    append(panel_body, "<p>BBTYPE: " + infos.BBTYPE + "</p>");
    append(panel_body, "<p>BBTYPE: " + infos.BBTYPE + "</p>");
    append(panel_body, "<p>ETHNICITY: " + infos.ETHNICITY + "</p>");
    append(panel_body, "<p>Gender: " + infos.GENDER + "</p>");
    append(panel_body, "<p>Location: " + infos.LOCATION + "</p>");
    append(panel_body, "<p>WFREQ: " + infos.WFREQ + "</p>");
    append(panel_body, "<p>Sample: " + infos.sample + "</p>");
  });
}

function append(element, child){
  element.innerHTML = element.innerHTML + child;
}

function normalize(arr, range){
  const max_val = Math.max(...arr);
  ans = [];
  arr.forEach(e => ans.push(Math.round(e / max_val * range)));
  return ans;
}

function buildCharts(sample) {
  buildPiChart(sample);
  buildBubbleChart(sample);
}

function buildPiChart(sample) {
  d3.json("/samples/" + sample).then(record => {
    pairs = [];
    for (i = 0; i < record.otu_ids.length; i++)
      pairs.push({
        out_id: record.otu_ids[i],
        out_label: record.otu_labels[i],
        val: record.sample_values[i]
      });
    function custom_comp(a, b) {
      return b.val - a.val;
    }
    pairs = pairs.sort(custom_comp).slice(0, 10);
    var vals = [];
    var ids = [];
    var lbls = [];
    pairs.forEach(p => {
      vals.push(p.val);
      ids.push(p.out_id);
      lbls.push(p.out_label);
    });
    var data = [
      {
        values: vals,
        labels: ids,
        type: "pie",
        text: lbls,
        textinfo: "value"
      }
    ];
    var layout = {
      title: "Pie Chart",
      height: 500,
      width: 500
    };
    Plotly.newPlot("pie", data, layout);
  });
}

function buildBubbleChart(sample) {
  d3.json("/samples/" + sample).then(record => {
    pairs = [];
    for (i = 0; i < record.otu_ids.length; i++)
      pairs.push({
        out_id: record.otu_ids[i],
        out_label: record.otu_labels[i],
        val: record.sample_values[i]
      });
    var vals = [];
    var ids = [];
    var lbls = [];
    pairs.forEach(p => {
      vals.push(p.val);
      ids.push(p.out_id);
      lbls.push(p.out_label);
    });
    
    function make_color(c) {
      r = 255 - c;
      g = c;
      b = 255 - c;
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
    var clrs = [];
    normalize(ids, 255).forEach(val => clrs.push(make_color(val)));
    var trace1 = {
      x: ids,
      y: vals,
      mode: "markers",
      text: lbls,
      marker: {
        size: normalize(vals, 100),
        color: clrs
      }
    };
    var data = [trace1];
    var layout = {
      title: "Bubble Chart",
      showlegend: false,
    };
    Plotly.newPlot("bubble", data, layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then(sampleNames => {
    sampleNames.forEach(sample => {
      selector
        .append("option")
        .text("Sample " + sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  console.log(newSample);
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();

function enter(value) {
  console.log("Entered Here: ", value);
}
