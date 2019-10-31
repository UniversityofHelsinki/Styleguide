it('01 Colors', function () {
  return this.browser
    .url('/#section-1')
    .assertView('text_colors', '#section-1-1-1 .idean-styleguide-colors-grid')
    .assertView('$blue', '.idean-styleguide-colors-list-sample:nth-of-type(1)')
    .assertView(
      '$blue--active ',
      '.idean-styleguide-colors-list-sample:nth-of-type(2)'
    )
    .assertView(
      '$darkblue',
      '.idean-styleguide-colors-list-sample:nth-of-type(3)'
    )
    .assertView(
      '$darkblue-active',
      '.idean-styleguide-colors-list-sample:nth-of-type(4)'
    )
    .assertView(
      '$lightsilver',
      '.idean-styleguide-colors-list-sample:nth-of-type(5)'
    )
    .assertView(
      '$mediumsilver',
      '.idean-styleguide-colors-list-sample:nth-of-type(6)'
    )
    .assertView(
      '$silver',
      '.idean-styleguide-colors-list-sample:nth-of-type(7)'
    )
    .assertView(
      '$lightgra',
      '.idean-styleguide-colors-list-sample:nth-of-type(8)'
    )
    .assertView(
      '$darkgray',
      '.idean-styleguide-colors-list-sample:nth-of-type(9)'
    )
    .assertView('$red', '.idean-styleguide-colors-list-sample:nth-of-type(10)')
    .assertView(
      '$redalert',
      '.idean-styleguide-colors-list-sample:nth-of-type(11)'
    )
    .assertView(
      '$purple',
      '.idean-styleguide-colors-list-sample:nth-of-type(12)'
    )
    .assertView(
      '$orange',
      '.idean-styleguide-colors-list-sample:nth-of-type(13)'
    )
    .assertView(
      '$darkorange',
      '.idean-styleguide-colors-list-sample:nth-of-type(14)'
    )
    .assertView(
      '$green',
      '.idean-styleguide-colors-list-sample:nth-of-type(15)'
    )
    .assertView(
      '$darkgreen',
      '.idean-styleguide-colors-list-sample:nth-of-type(16)'
    );
});

it('02 Icons', function () {
  return this.browser
    .url('/#section-2')
    .assertView('icons', '#section-2-1 .idean-styleguide-demo-example', {
      ignoreElements: ['.icon--spinner']
    });
});

it('03 Common elements', function () {
  return this.browser
    .url('/#section-3')
    .assertView('Headings', '#section-3-1 .idean-styleguide-demo-example')
    .assertView('Paragraph', '#section-3-2 .idean-styleguide-demo-example')
    .assertView('Links', '#section-3-3 .idean-styleguide-demo-example')
    .assertView('Blockquote', '#section-3-4-1 .idean-styleguide-demo-example')
    .assertView(
      'Blockquote paragraph',
      '#section-3-4-2 .idean-styleguide-demo-example'
    )
    .assertView(
      'Form elements paragraph',
      '#section-3-5 .idean-styleguide-demo-example'
    )
    .assertView('Button', '#section-3-7-1 .idean-styleguide-demo-example')
    .assertView(
      'Button small',
      '#section-3-7-1-1 .idean-styleguide-demo-example'
    )
    .assertView(
      'Button accordion',
      '#section-3-7-2 .idean-styleguide-demo-example'
    )
    .assertView(
      'Button action',
      '#section-3-7-3 .idean-styleguide-demo-example'
    )
    .assertView(
      'Button action before',
      '#section-3-7-4 .idean-styleguide-demo-example'
    )
    .assertView(
      'Button anchor',
      '#section-3-7-5 .idean-styleguide-demo-example'
    )
    .assertView('Button icon', '#section-3-7-6 .idean-styleguide-demo-example')
    .assertView(
      'Button groups',
      '#section-3-7-7 .idean-styleguide-demo-example'
    )
    .assertView(
      'Button groups small',
      '#section-3-7-8 .idean-styleguide-demo-example'
    )
    .assertView(
      'Button outline',
      '#section-3-7-9 .idean-styleguide-demo-example'
    );
});

it('04 Form', function () {
  return this.browser
    .url('/#section-4')
    .assertView('Form', '#section-4-1 .idean-styleguide-demo-example')
    .assertView('Search form', '#section-4-2-1 .idean-styleguide-demo-example')
    .assertView(
      'Search form dark',
      '#section-4-2-2 .idean-styleguide-demo-example'
    )
    .assertView(
      'Search form minimal',
      '#section-4-2-3 .idean-styleguide-demo-example'
    );
});

it('05 Menu', function () {
  return this.browser
    .url('/#section-5-1')
    .assertView('Main menu', '#section-5-1 .idean-styleguide-demo-example')
    .url('/#section-5-2')
    .assertView('Fatmenu', '.fatmenu');
});

it('06 Misc', function () {
  return this.browser
    .url('/#section-6-1-1')
    .assertView('Table', '#section-6-1-1 .idean-styleguide-demo-example')
    .url('/#section-6-1-2')
    .assertView('Table simple', '#section-6-1-2 .idean-styleguide-demo-example')
    .url('/#section-6-2-1')
    .assertView(
      'List of links',
      '#section-6-2-1 .idean-styleguide-demo-example'
    )
    .url('/#section-6-2-2')
    .assertView(
      'List of links (transparent)',
      '#section-6-2-2 .idean-styleguide-demo-example'
    )
    .url('/#section-6-2-3')
    .assertView(
      'List of links (condensed)',
      '#section-6-2-3 .idean-styleguide-demo-example'
    )
    .url('/#section-6-3-1')
    .assertView('Accordion', '#section-6-3-1 .idean-styleguide-demo-example')
    .url('/#section-6-3-2')
    .assertView(
      'Accordion (transparent buttons)',
      '#section-6-3-2 .idean-styleguide-demo-example'
    )
    .url('/#section-6-3-3')
    .assertView(
      'Accordion (nested)',
      '#section-6-3-3 .idean-styleguide-demo-example'
    )
    .url('/#section-6-3-4')
    .assertView(
      'Accordion (nested transparent buttons)',
      '#section-6-3-4 .idean-styleguide-demo-example'
    )
    .url('/#section-6-4')
    .assertView('Author', '#section-6-4 .idean-styleguide-demo-example')
    .url('/#section-6-5')
    .assertView('Breadcrumbs', '#section-6-5 .idean-styleguide-demo-example')
    .url('/#section-6-7')
    .assertView(
      'Horizontal tabs',
      '#section-6-7 .idean-styleguide-demo-example'
    )
    .url('/#section-6-8')
    .assertView('Pagination', '#section-6-8 .idean-styleguide-demo-example')
    .url('/#section-6-9')
    .assertView('Taglist', '#section-6-9 .idean-styleguide-demo-example')
    .url('/#section-6-10-1')
    .assertView(
      'Box application',
      '#section-6-10-1 .idean-styleguide-demo-example'
    )
    .url('/#section-6-10-2')
    .assertView('Box data', '#section-6-10-2 .idean-styleguide-demo-example')
    .url('/#section-6-10-4')
    .assertView('Box ingress', '#section-6-10-4 .idean-styleguide-demo-example')
    .url('/#section-6-10-5-1')
    .assertView('Box story', '#section-6-10-5-1 .idean-styleguide-demo-example')
    .url('/#section-6-10-5-2')
    .assertView(
      'Box story topical',
      '#section-6-10-5-2 .idean-styleguide-demo-example'
    )
    .url('/#section-6-10-5-3')
    .assertView(
      'Box story liftup',
      '#section-6-10-5-3 .idean-styleguide-demo-example'
    )
    .url('/#section-6-10-5-4')
    .assertView(
      'Box story constrained',
      '#section-6-10-5-4 .idean-styleguide-demo-example'
    )
    .url('/#section-6-10-5-5')
    .assertView(
      'Box story related',
      '#section-6-10-5-5 .idean-styleguide-demo-example'
    )
    .url('/#section-6-10-6')
    .assertView(
      'Box subsection',
      '#section-6-10-6 .idean-styleguide-demo-example'
    )
    .url('/#section-6-10-7')
    .assertView(
      'Box subtitle',
      '#section-6-10-7 .idean-styleguide-demo-example'
    )
    .url('/#section-6-10-7-1')
    .assertView(
      'Box subtitle icon',
      '#section-6-10-7-1 .idean-styleguide-demo-example'
    )
    .url('/#section-6-10-8')
    .assertView('Box card', '#section-6-10-8 .idean-styleguide-demo-example')
    .url('/#section-6-10-9')
    .assertView('Box logo', '#section-6-10-9 .idean-styleguide-demo-example')
    .url('/#section-6-10-10')
    .assertView('Box liftup', '#section-6-10-10 .idean-styleguide-demo-example')
    .url('/#section-6-11-1')
    .assertView('Textarea', '#section-6-11-1 .idean-styleguide-demo-example')
    .url('/#section-6-11-2')
    .assertView(
      'Textarea infobox',
      '#section-6-11-2 .idean-styleguide-demo-example'
    )
    .url('/#section-6-11-3')
    .assertView(
      'Textarea ingress',
      '#section-6-11-3 .idean-styleguide-demo-example'
    )
    .url('/#section-6-12-1')
    .assertView(
      'Status message',
      '#section-6-12-1 .idean-styleguide-demo-example'
    )
    .url('/#section-6-12-2')
    .assertView(
      'Info message',
      '#section-6-12-2 .idean-styleguide-demo-example'
    )
    .url('/#section-6-12-3')
    .assertView(
      'Error message',
      '#section-6-12-3 .idean-styleguide-demo-example'
    );
});

it('07 Carousel', function () {
  return this.browser
    .url('/#section-7-1-1')
    .assertView('Carousel', '#section-7-1-1 .idean-styleguide-demo-example')
    .url('/#section-7-1-2')
    .assertView(
      'Carousel unwrapped',
      '#section-7-1-2 .idean-styleguide-demo-example'
    );
});

it('08 Feed listing', function () {
  return this.browser
    .url('/#section-8-1')
    .assertView('Feed Listing', '#section-8-1 .idean-styleguide-demo-example');
});

it('09 Index', function () {
  return this.browser
    .url('/#section-9-1-1')
    .assertView('Index', '#section-9-1-1 .idean-styleguide-demo-example')
    .url('/#section-9-1-2')
    .assertView(
      'Index alphabetical',
      '#section-9-1-2 .idean-styleguide-demo-example'
    )
    .url('/#section-9-1-3')
    .assertView(
      'Index topical',
      '#section-9-1-3 .idean-styleguide-demo-example'
    );
});

it('10 Jobs listing', function () {
  return this.browser
    .url('/#section-10-1')
    .assertView('Jobs listing', '#section-10-1 .idean-styleguide-demo-example');
});

it('11 Panel', function () {
  return this.browser
    .url('/#section-11-1')
    .assertView('Panel', '#section-11-1 .idean-styleguide-demo-example')
    .url('/#section-11-1-1')
    .assertView('File', '#section-11-1-1 .idean-styleguide-demo-example');
});

it('12 Avatar', function () {
  return this.browser
    .url('/#section-12-1-1')
    .assertView(
      'Avatar image',
      '#section-12-1-1 .idean-styleguide-demo-example'
    );
});

it('13 Label row', function () {
  return this.browser
    .url('/#section-13-1')
    .assertView('Label row', '#section-13-1 .idean-styleguide-demo-example');
});

it('14 Post', function () {
  return this.browser
    .url('/#section-14-1')
    .assertView('Post', '#section-14-1 .idean-styleguide-demo-example');
});

it('15 Bars', function () {
  return this.browser
    .url('/#section-15-1')
    .assertView('Top bar', '#section-15-1 .idean-styleguide-demo-example')
    .url('/#section-15-1-1')
    .assertView(
      'Top bar small',
      '#section-15-1-1 .idean-styleguide-demo-example'
    )
    .url('/#section-15-1-2')
    .assertView('Header bar', '#section-15-1-2 .idean-styleguide-demo-example')
    .url('/#section-15-2')
    .assertView('Footer', '#section-15-2 .idean-styleguide-demo-example');
});

it('16 Hero', function () {
  return this.browser
    .url('/#section-16-1-1')
    .assertView('Hero', '#section-16-1-1 .idean-styleguide-demo-example');
  /* cannot test because of video 
      .url('/#section-16-1-2')
      .assertView('Hero big', '#section-16-1-2 .idean-styleguide-demo-example', {ignoreElements: ['.hero-big__video']})
      */
});

it('17 Overlay', function () {
  return this.browser
    .url('/#section-17-1')
    .assertView('Overlay', '#section-17-1 .l-overlay');
});

it('18 Liftup', function () {
  return this.browser
    .url('/#section-18-1')
    .assertView('Liftup grid', '#section-18-1 .idean-styleguide-demo-example')
    // TODO fix this: does not render properly
    //.url('/#section-18-2')
    //.assertView('Liftup', '#section-18-2 .idean-styleguide-demo-example')
    .url('/#section-18-3')
    .assertView(
      'Liftup mosaic',
      '#section-18-3 .idean-styleguide-demo-example'
    );
});

it('19 Highlight', function () {
  return this.browser
    .url('/#section-19-1')
    .assertView('Highlight', '#section-19-1 .idean-styleguide-demo-example');
});

it('20 Link grid', function () {
  return this.browser
    .url('/#section-20-1')
    .assertView('Link grid', '#section-20-1 .idean-styleguide-demo-example');
});

it('21 Video player', function () {
  return this.browser
    .url('/#section-21-1')
    .assertView('Video player', '#section-21-1 .idean-styleguide-demo-example', { screenshotDelay: 1000, tolerance: 2.5 });
});

it('22 Media item', function () {
  return this.browser
    .url('/#section-22-1')
    .assertView('Media item', '#section-22-1 .idean-styleguide-demo-example');
});
