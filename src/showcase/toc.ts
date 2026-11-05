export const toc = [
  {
    group: 'Foundation',
    items: [
      ['colours', 'Colours'],
      ['typography', 'Typography'],
      ['iconography', 'Iconography'],
      ['effects', 'Effects styles'],
      ['motion', 'Motion'],
      ['spacing', 'Spacing, radius and grid'],
    ],
  },
  {
    group: 'Base components',
    items: [
      ['accordion', 'Accordion'],
      ['avatar', 'Avatar'],
      ['badges', 'Badges'],
      ['buttons', 'Button group'],
      ['checkbox', 'Checkbox'],
      ['dropdown', 'Dropdown'],
      ['fileupload', 'File upload'],
      ['inputs', 'Inputs'],
      ['pagination', 'Pagination'],
      ['progress', 'Progress indicator'],
      ['select', 'Select'],
      ['sliders', 'Sliders'],
      ['tags', 'Tags'],
      ['editor', 'Text editors'],
      ['toggles', 'Toggles'],
      ['tooltip', 'Tooltip'],
    ],
  },
  {
    group: 'Application components',
    items: [
      ['activity', 'Activity feed'],
      ['alerts', 'Alert and notification'],
      ['navigation', 'Application navigation'],
      ['breadcrumbs', 'Breadcrumbs'],
      ['calendar', 'Calendar'],
      ['datatable', 'Data table'],
      ['datepicker', 'Date picker'],
      ['command', 'Command menu'],
      ['drawer', 'Drawer'],
      ['empty', 'Empty state'],
      ['skeleton', 'Skeleton loader state'],
      ['error', 'Error state'],
      ['offline', 'No network state'],
      ['loading', 'Loading'],
      ['metrics', 'Metrics'],
      ['modals', 'Modals'],
      ['tabs', 'Tabs'],
    ],
  },
  {
    group: 'Data visualisation',
    items: [
      ['charts-rules', 'Chart principles'],
      ['linechart', 'Line chart'],
      ['barchart', 'Bar chart'],
      ['donut', 'Donut chart'],
      ['funnel', 'Funnel'],
      ['heatmap', 'Heatmap'],
      ['gauge', 'Gauge and sparkline'],
      ['scatter', 'Scatter plot'],
      ['tilemap', 'Ward tile map'],
      ['timeline', 'Timeline'],
      ['composition', 'Composition bar'],
    ],
  },
] as const

const flat: string[] = toc.flatMap((g) => g.items.map(([id]) => id as string))

/** Two-digit section number derived from position in the contents. */
export const sectionNumber = (id: string) => String(flat.indexOf(id) + 1).padStart(2, '0')
