
import type { AnalysisResult, CsvData, ChartSuggestion } from '../types';

const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportForPowerBI = (analysis: AnalysisResult, data: CsvData, fileName: string) => {
  const exportData = {
    dataSource: `Connect to your original CSV file: ${fileName}`,
    analysisSummary: analysis.summary,
    insights: analysis.insights,
    chartSuggestions: analysis.chartSuggestions,
    dataSnippet: data.slice(0, 10),
  };
  const jsonContent = JSON.stringify(exportData, null, 2);
  downloadFile(jsonContent, 'AutoBI_PowerBI_Guide.json', 'application/json');
};


const generateTableauWorksheet = (chart: ChartSuggestion, csvFileName: string): string => {
  const cleanTitle = chart.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Tableau creates a datasource name from the filename, let's try to mimic it.
  const datasourceName = `${csvFileName.split('.')[0]}#csv`;
  
  let columns = '';
  let rows = '';
  let mark = '<mark class="Bar" />';

  const formatField = (field: string | null) => field ? `[${field.replace(/]/g, ']]')}]` : '';

  switch (chart.chartType) {
    case 'bar':
    case 'grouped-bar':
    case 'stacked-bar':
      columns = `<column>${formatField(chart.x_axis)}</column>`;
      rows = `<row>[federated.${datasourceName}].[sum:${formatField(chart.y_axis)}]</row>`;
      mark = `<mark class="Bar" />`;
      if (chart.grouping_column) {
         mark += `<encodings><color column="${formatField(chart.grouping_column)}" /></encodings>`;
      }
      break;
    case 'line':
    case 'area':
      columns = `<column>${formatField(chart.x_axis)}</column>`;
      rows = `<row>[federated.${datasourceName}].[sum:${formatField(chart.y_axis)}]</row>`;
      mark = `<mark class="${chart.chartType === 'line' ? 'Line' : 'Area'}" />`;
      break;
    case 'scatter':
      columns = `<column>[federated.${datasourceName}].[sum:${formatField(chart.grouping_column || chart.x_axis)}]</column>`;
      rows = `<row>[federated.${datasourceName}].[sum:${formatField(chart.y_axis)}]</row>`;
      mark = `<mark class="Circle" />`;
      break;
    case 'pie':
    case 'donut':
        rows = `<row>[federated.${datasourceName}].[sum:${formatField(chart.y_axis)}]</row>`;
        mark = `<mark class="Pie" />
        <encodings>
            <color column="${formatField(chart.x_axis)}" />
            <angle column="[federated.${datasourceName}].[sum:${formatField(chart.y_axis)}]" />
        </encodings>
        `;
      break;
    default:
        // Fallback for KPI or other types
        return '';
  }

  return `
    <worksheet name='${cleanTitle}'>
      <table>
        <view>
          <datasources>
            <datasource caption='${csvFileName}' name='federated.${datasourceName}' />
          </datasources>
          <shelf-sorts />
          <aggregation value='true' />
        </view>
        <style />
        <panes>
          <pane>
            ${mark}
          </pane>
        </panes>
        <rows>${rows}</rows>
        <cols>${columns}</cols>
      </table>
    </worksheet>
  `;
};

export const exportForTableau = (analysis: AnalysisResult, csvFileName: string) => {
  const worksheets = analysis.chartSuggestions.map(chart => generateTableauWorksheet(chart, csvFileName)).join('');
  
  const twbContent = `<?xml version='1.0' encoding='utf-8' ?>
<workbook version='18.1' xmlns:user='http://www.tableausoftware.com/xml/user'>
  <preferences>
  </preferences>
  <datasources>
    <datasource caption='${csvFileName}' inline='true' name='federated.${csvFileName.split('.')[0]}#csv' version='18.1'>
      <connection class='textscan' directory='.' filename='${csvFileName}' password='' server='' />
    </datasource>
  </datasources>
  <worksheets>
    ${worksheets}
  </worksheets>
  <windows source-height='30'>
     <window class='dashboard' name='AutoBI Dashboard'>
        <viewpoints>
        </viewpoints>
     </window>
  </windows>
</workbook>`;

  downloadFile(twbContent, 'AutoBI_Tableau_Dashboard.twb', 'application/xml');
};
