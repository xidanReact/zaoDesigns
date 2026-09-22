// СНК · UI kit builder
// Собирает UI kit главной страницы в текущем файле Figma:
// переменные (Primitives → Color, Spacing, Radius), стили текста и теней,
// страницы Cover / Foundations / Components с вариантами компонентов.
// Значения совпадают с designs/styles.css.

(async () => {
  const errors = [];
  const step = async (name, fn) => {
    try { return await fn(); } catch (e) { errors.push(`${name}: ${(e && e.message) || e}`); return null; }
  };

  const H = hex => {
    const n = parseInt(hex.replace('#', ''), 16);
    return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
  };

  /* ---------- Защита от повторного запуска ---------- */
  const existing = await figma.variables.getLocalVariableCollectionsAsync();
  if (existing.some(c => c.name === 'СНК / Primitives')) {
    figma.closePlugin('UI kit уже собран в этом файле — удалите коллекции «СНК / …», чтобы собрать заново');
    return;
  }

  /* ---------- Шрифты ---------- */
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  const loadFont = async (family, style, fbStyle) => {
    try { await figma.loadFontAsync({ family, style }); return { family, style }; }
    catch (e) {
      errors.push(`Шрифт ${family} ${style} недоступен — заменён на Inter ${fbStyle}`);
      const fb = { family: 'Inter', style: fbStyle };
      await figma.loadFontAsync(fb);
      return fb;
    }
  };
  const F = {
    x800: await loadFont('Manrope', 'ExtraBold', 'Extra Bold'),
    b700: await loadFont('Manrope', 'Bold', 'Bold'),
    s600: await loadFont('Manrope', 'SemiBold', 'Semi Bold'),
    m500: await loadFont('Manrope', 'Medium', 'Medium'),
    mono: await loadFont('JetBrains Mono', 'Regular', 'Regular'),
    monoM: await loadFont('JetBrains Mono', 'Medium', 'Medium')
  };

  /* =========================================================
     1. Переменные
     ========================================================= */
  const PRIMS = {
    'white': '#FFFFFF',
    'gray/50': '#F7F8FA',
    'gray/100': '#F1F3F6',
    'gray/150': '#EEF1F5',
    'gray/200': '#E3E7EC',
    'gray/600': '#5B6773',
    'gray/900': '#1F2933',
    'red/600': '#D32F2F',
    'red/700': '#B82727',
    'blueprint/100': '#D5DDE6',
    'blueprint/150': '#DDE3EA',
    'blueprint/300': '#9FB0C3'
  };
  const prim = figma.variables.createVariableCollection('СНК / Primitives');
  prim.renameMode(prim.modes[0].modeId, 'Value');
  const P = {};
  for (const [name, hex] of Object.entries(PRIMS)) {
    const v = figma.variables.createVariable(name, prim, 'COLOR');
    v.setValueForMode(prim.modes[0].modeId, Object.assign(H(hex), { a: 1 }));
    v.scopes = [];
    v.hiddenFromPublishing = true;
    P[name] = v;
  }

  const BG = ['FRAME_FILL', 'SHAPE_FILL'];
  const TX = ['TEXT_FILL'];
  const ST = ['STROKE_COLOR'];
  const SEM = [
    ['color/bg/default', 'white', '--bg', BG],
    ['color/bg/soft', 'gray/50', '--bg-soft', BG],
    ['color/surface/default', 'gray/100', '--surface', BG],
    ['color/surface/strong', 'gray/150', '--surface-2', BG],
    ['color/text/primary', 'gray/900', '--text', [...TX, ...ST, 'SHAPE_FILL']],
    ['color/text/muted', 'gray/600', '--text-muted', [...TX, ...ST]],
    ['color/text/on-accent', 'white', '--bg', [...TX, ...ST]],
    ['color/accent/default', 'red/600', '--accent', [...BG, ...TX, ...ST]],
    ['color/accent/hover', 'red/700', '--accent-hover', [...BG, ...TX, ...ST]],
    ['color/border/default', 'gray/200', '--line', [...ST, 'SHAPE_FILL']],
    ['color/blueprint/line', 'blueprint/300', '--blueprint', [...ST, 'SHAPE_FILL']],
    ['color/blueprint/soft', 'blueprint/100', '--blueprint-soft', [...ST, 'SHAPE_FILL']],
    ['color/watermark', 'blueprint/150', '--watermark', ST]
  ];
  const colColl = figma.variables.createVariableCollection('СНК / Color');
  colColl.renameMode(colColl.modes[0].modeId, 'Light');
  const C = {};
  for (const [name, p, css, scopes] of SEM) {
    const v = figma.variables.createVariable(name, colColl, 'COLOR');
    v.setValueForMode(colColl.modes[0].modeId, { type: 'VARIABLE_ALIAS', id: P[p].id });
    v.scopes = scopes;
    v.setVariableCodeSyntax('WEB', `var(${css})`);
    C[name.replace('color/', '')] = v;
  }

  const spColl = figma.variables.createVariableCollection('СНК / Spacing');
  spColl.renameMode(spColl.modes[0].modeId, 'Value');
  const S = {};
  for (const n of [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 44, 48, 56, 60, 64, 88, 96, 120]) {
    const v = figma.variables.createVariable(`spacing/${n}`, spColl, 'FLOAT');
    v.setValueForMode(spColl.modes[0].modeId, n);
    v.scopes = ['GAP'];
    v.setVariableCodeSyntax('WEB', `${n}px`);
    S[n] = v;
  }
  const rColl = figma.variables.createVariableCollection('СНК / Radius');
  rColl.renameMode(rColl.modes[0].modeId, 'Value');
  const R = {};
  for (const [k, val, css] of [['xs', 4, '4px'], ['sm', 8, 'var(--r-sm)'], ['md', 12, 'var(--r-md)'], ['lg', 20, 'var(--r-lg)'], ['full', 999, '999px']]) {
    const v = figma.variables.createVariable(`radius/${k}`, rColl, 'FLOAT');
    v.setValueForMode(rColl.modes[0].modeId, val);
    v.scopes = ['CORNER_RADIUS'];
    v.setVariableCodeSyntax('WEB', css);
    R[k] = v;
  }

  /* =========================================================
     2. Стили текста и теней
     ========================================================= */
  const TS = {};
  const textStyle = (key, name, font, size, lh, ls, desc) => {
    const s = figma.createTextStyle();
    s.name = name;
    s.fontName = font;
    s.fontSize = size;
    s.lineHeight = { unit: 'PERCENT', value: lh };
    s.letterSpacing = { unit: 'PERCENT', value: ls };
    if (desc) s.description = desc;
    TS[key] = s;
  };
  textStyle('h1', 'Display/H1', F.x800, 58, 105, -3.8, 'Hero, 56–64px на десктопе');
  textStyle('cta', 'Display/CTA', F.x800, 88, 100, -4.5, 'Финальный CTA');
  textStyle('metric', 'Display/Metric', F.x800, 76, 100, -4.5, 'Числа метрик, tabular-nums');
  textStyle('h2', 'Heading/H2', F.x800, 48, 108, -3.2);
  textStyle('h3xl', 'Heading/Card XL', F.x800, 32, 120, -2.5);
  textStyle('h3', 'Heading/Card', F.x800, 24, 120, -2.5);
  textStyle('marquee', 'Heading/Marquee', F.x800, 34, 120, -3);
  textStyle('step', 'Heading/Step', F.x800, 21, 125, -2);
  textStyle('news', 'Heading/News', F.b700, 21, 130, -2);
  textStyle('lead', 'Body/Lead', F.m500, 19, 155, 0);
  textStyle('body', 'Body/Default', F.m500, 17, 160, 0);
  textStyle('small', 'Body/Small', F.m500, 15.5, 155, 0);
  textStyle('button', 'UI/Button', F.b700, 16, 100, -0.5);
  textStyle('buttonL', 'UI/Button L', F.b700, 17, 100, -0.5);
  textStyle('nav', 'UI/Nav', F.s600, 15.5, 100, 0);
  textStyle('tag', 'UI/Tag', F.b700, 12.5, 130, 0);
  textStyle('brand', 'UI/Brand', F.x800, 18, 120, -2);
  textStyle('brandSub', 'UI/Brand sub', F.s600, 11.5, 130, 0);
  textStyle('field', 'UI/Field', F.s600, 16, 130, 0);
  textStyle('label', 'Mono/Label', F.mono, 12, 140, 4, 'Моно-метки, нумерация, даты');
  textStyle('caption', 'Mono/Caption', F.mono, 11, 140, 4, 'Подписи на схеме: ТРК-01, Р-02');

  const shadow = (name, effects) => { const s = figma.createEffectStyle(); s.name = name; s.effects = effects; return s; };
  const ds = (y, blur, spread, a) => ({
    type: 'DROP_SHADOW', color: Object.assign(H('#1F2933'), { a }), offset: { x: 0, y },
    radius: blur, spread, visible: true, blendMode: 'NORMAL'
  });
  const E = {
    sm: shadow('Shadow/Soft sm', [ds(1, 2, 0, 0.04), ds(2, 8, 0, 0.04)]),
    md: shadow('Shadow/Soft md', [ds(2, 6, 0, 0.04), ds(12, 32, -8, 0.10)])
  };

  /* =========================================================
     Хелперы построения
     ========================================================= */
  const paint = v => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v);
  const fill = (n, v) => { n.fills = v ? [paint(v)] : []; };
  const stroke = (n, v, w = 1, align = 'INSIDE') => { n.strokes = [paint(v)]; n.strokeWeight = w; n.strokeAlign = align; };
  const radius = (n, v) => ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'].forEach(k => n.setBoundVariable(k, v));
  const pad = (n, x, y, top, bottom) => {
    n.setBoundVariable('paddingLeft', S[x]); n.setBoundVariable('paddingRight', S[x]);
    n.setBoundVariable('paddingTop', S[top != null ? top : y]); n.setBoundVariable('paddingBottom', S[bottom != null ? bottom : y]);
  };
  const gap = (n, g) => n.setBoundVariable('itemSpacing', S[g]);
  const sizeIcon = (inst, px) => { inst.rescale(px / inst.width); return inst; }; // масштабирует и векторы, и обводку

  const frame = (dir, name, opts = {}) => {
    const f = opts.component ? figma.createComponent() : figma.createFrame();
    f.name = name;
    f.fills = [];
    if (dir) {
      f.layoutMode = dir;
      f.primaryAxisSizingMode = 'AUTO';
      f.counterAxisSizingMode = 'AUTO';
    }
    return f;
  };
  const text = async (chars, style, colorVar, opts = {}) => {
    const t = figma.createText();
    t.fontName = style.fontName;
    t.characters = chars;
    await t.setTextStyleIdAsync(style.id);
    if (colorVar) fill(t, colorVar);
    if (opts.width) { t.resize(opts.width, t.height); t.textAutoResize = 'HEIGHT'; }
    if (opts.name) t.name = opts.name;
    return t;
  };
  const place = (parent, child, sizing) => {
    parent.appendChild(child);
    if (sizing && sizing.h) child.layoutSizingHorizontal = sizing.h;
    if (sizing && sizing.v) child.layoutSizingVertical = sizing.v;
    return child;
  };
  const recolorVectors = (node, v) => {
    const vs = node.findAll(n => n.type === 'VECTOR' || n.type === 'ELLIPSE' || n.type === 'RECTANGLE' || n.type === 'LINE');
    vs.forEach(n => {
      if (n.strokes && n.strokes.length) n.strokes = [paint(v)];
      if (n.fills && n.fills.length && n.fills[0].type === 'SOLID') n.fills = [paint(v)];
    });
  };
  const variantGrid = (set, width) => {
    set.layoutMode = 'HORIZONTAL';
    set.layoutWrap = 'WRAP';
    set.resize(width, 100);
    set.primaryAxisSizingMode = 'FIXED';
    set.counterAxisSizingMode = 'AUTO';
    set.itemSpacing = 24;
    set.counterAxisSpacing = 24;
    set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 32;
    set.counterAxisAlignItems = 'MIN';
    set.fills = [paint(C['bg/default'])];
    set.strokes = [{ type: 'SOLID', color: H('#9747FF') }];
    set.dashPattern = [6, 4];
    set.strokeWeight = 1;
    set.cornerRadius = 16;
  };

  /* ---------- Страницы ---------- */
  const pages = figma.root.children;
  for (const p of pages) await p.loadAsync();
  const emptyDefault = pages.find(p => p.children.length === 0);
  const capture = pages.find(p => p.children.length > 0);
  if (capture) capture.name = 'Главная · 1440 (снимок сайта)';
  const cover = emptyDefault || figma.createPage();
  cover.name = 'Cover';
  const foundations = figma.createPage(); foundations.name = 'Foundations';
  const sep = figma.createPage(); sep.name = '---';
  const components = figma.createPage(); components.name = 'Components';
  figma.root.insertChild(0, cover);
  if (capture) figma.root.insertChild(1, capture);

  /* =========================================================
     3. Иконки
     ========================================================= */
  const ICONS = {
    Arrow: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="#1F2933" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    Chevron: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" fill="none" stroke="#1F2933" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    Lock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#1F2933" stroke-width="1.6" stroke-linecap="round"/><rect x="5" y="11" width="14" height="9.5" rx="2.2" fill="none" stroke="#1F2933" stroke-width="1.6"/><path d="M12 15v2" fill="none" stroke="#1F2933" stroke-width="1.6" stroke-linecap="round"/></svg>',
    Pin: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" fill="none" stroke="#1F2933" stroke-width="1.5"/><circle cx="12" cy="10" r="2.4" fill="none" stroke="#1F2933" stroke-width="1.5"/></svg>',
    Mail: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="#1F2933" stroke-width="1.5"/><path d="M4 7l8 6 8-6" fill="none" stroke="#1F2933" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    Phone: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.6 3.5h3l1.5 4-2 1.3a10.5 10.5 0 0 0 6.1 6.1l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2.1-2.2z" fill="none" stroke="#1F2933" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    Check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="#1F2933" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    Dispenser: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="8" y="5" width="12" height="22" rx="2" fill="none" stroke="#1F2933" stroke-width="1.4"/><rect x="10.5" y="8" width="7" height="5" rx="1" fill="none" stroke="#1F2933" stroke-width="1.4"/><path d="M20 13h3v7a2 2 0 0 0 4 0v-9l-3-3 M5 27h18" fill="none" stroke="#1F2933" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    Code: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="17" rx="2" fill="none" stroke="#1F2933" stroke-width="1.4"/><path d="M11 27h10M16 23v4 M10 12l-3 3 3 3M22 12l3 3-3 3M18 11l-4 8" fill="none" stroke="#1F2933" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    Tanks: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M5 11v15h9V11 M18 11v15h9V11 M3 26h26 M14 21h4" fill="none" stroke="#1F2933" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="9.5" cy="11" rx="4.5" ry="1.8" fill="none" stroke="#1F2933" stroke-width="1.4"/><ellipse cx="22.5" cy="11" rx="4.5" ry="1.8" fill="none" stroke="#1F2933" stroke-width="1.4"/></svg>',
    Network: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="3.5" fill="none" stroke="#1F2933" stroke-width="1.4"/><circle cx="6" cy="7" r="2.5" fill="none" stroke="#1F2933" stroke-width="1.4"/><circle cx="26" cy="8" r="2.5" fill="none" stroke="#1F2933" stroke-width="1.4"/><circle cx="7" cy="25" r="2.5" fill="none" stroke="#1F2933" stroke-width="1.4"/><circle cx="25" cy="25" r="2.5" fill="none" stroke="#1F2933" stroke-width="1.4"/><path d="M8 9l5.5 4.5M24 10l-5.5 4M9 23l4.5-4.5M23 23l-4.5-4.5" fill="none" stroke="#1F2933" stroke-width="1.4" stroke-linecap="round"/></svg>'
  };
  const MONOGRAM = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="48" viewBox="0 0 120 48"><path d="M38 11H22.5A12.5 12.5 0 0 0 10 23.5v1A12.5 12.5 0 0 0 22.5 37H38 M48 11v26 M72 11v26 M48 24h24 M84 11v26 M106 11L86.5 24 106 37" fill="none" stroke="#D32F2F" stroke-width="5" stroke-linecap="square"/></svg>';

  await figma.setCurrentPageAsync(components);

  // Колонка секций страницы Components
  const board = frame('VERTICAL', 'Components');
  board.itemSpacing = 96;
  board.paddingLeft = board.paddingRight = board.paddingTop = board.paddingBottom = 80;
  fill(board, C['bg/soft']);
  board.x = 0; board.y = 0;
  components.appendChild(board);

  const section = async (title, desc) => {
    const s = frame('VERTICAL', `Section/${title}`);
    s.itemSpacing = 24;
    place(board, s);
    const head = frame('VERTICAL', 'Header'); head.itemSpacing = 8;
    place(s, head);
    place(head, await text(title, TS.h2, C['text/primary']));
    if (desc) place(head, await text(desc, TS.small, C['text/muted'], { width: 760 }));
    return s;
  };

  const I = {};
  await step('Иконки', async () => {
    const s = await section('Icons', 'Контурные иконки 1.4–1.6px. Цвет наследуется от color/text/primary, в компонентах переопределяется.');
    const row = frame('HORIZONTAL', 'Icons'); row.itemSpacing = 24;
    place(s, row);
    for (const [name, svg] of Object.entries(ICONS)) {
      const node = figma.createNodeFromSvg(svg);
      const comp = figma.createComponentFromNode(node);
      comp.name = `Icon/${name}`;
      comp.fills = [];
      recolorVectors(comp, C['text/primary']);
      comp.description = `Иконка «${name}», inline SVG на сайте`;
      place(row, comp);
      I[name] = comp;
    }
    const mono = figma.createComponentFromNode(figma.createNodeFromSvg(MONOGRAM));
    mono.name = 'Logo/Monogram СНК';
    mono.fills = [];
    recolorVectors(mono, C['accent/default']);
    mono.description = 'Монограмма СНК, красный #D32F2F (color/accent/default)';
    place(row, mono);
    I.Monogram = mono;
  });

  /* ---------- Button ---------- */
  let buttonSet = null;
  await step('Button', async () => {
    const s = await section('Button', 'Style × Size × State. Кнопки — pill (radius/full). Нажатие в коде: scale 0.97; фокус: красное кольцо 2px с отступом 3px. Красные кнопки на сайте магнитные.');
    const variants = [];
    for (const style of ['Primary', 'Outline', 'Ghost']) {
      for (const size of ['M', 'L']) {
        for (const state of ['Default', 'Hover', 'Focus', 'Disabled']) {
          const c = figma.createComponent();
          c.name = `Style=${style}, Size=${size}, State=${state}`;
          c.resize(160, size === 'L' ? 60 : 52);
          c.layoutMode = 'HORIZONTAL';
          c.primaryAxisSizingMode = 'AUTO';
          c.counterAxisSizingMode = 'FIXED';
          c.primaryAxisAlignItems = 'CENTER';
          c.counterAxisAlignItems = 'CENTER';
          pad(c, style === 'Ghost' ? 16 : (size === 'L' ? 32 : 24), 0);
          gap(c, 8);
          radius(c, R.full);
          const hover = state === 'Hover';
          const fg = style === 'Primary' ? C['text/on-accent'] : (style === 'Ghost' && !hover ? C['text/muted'] : C['text/primary']);
          if (style === 'Primary') fill(c, hover ? C['accent/hover'] : C['accent/default']);
          else if (style === 'Outline') { fill(c, C['bg/default']); stroke(c, hover ? C['text/primary'] : C['blueprint/line'], 1.5); }
          else fill(c, hover ? C['surface/default'] : state === 'Focus' ? C['bg/default'] : null);
          if (state === 'Focus') {
            c.effects = [
              { type: 'DROP_SHADOW', color: Object.assign(H('#D32F2F'), { a: 1 }), offset: { x: 0, y: 0 }, radius: 0, spread: 5, visible: true, blendMode: 'NORMAL', showShadowBehindNode: false },
              { type: 'DROP_SHADOW', color: Object.assign(H('#FFFFFF'), { a: 1 }), offset: { x: 0, y: 0 }, radius: 0, spread: 3, visible: true, blendMode: 'NORMAL', showShadowBehindNode: false }
            ];
          }
          if (state === 'Disabled') c.opacity = 0.4;
          const icon = I.Lock.createInstance();
          icon.name = 'Icon';
          sizeIcon(icon, 20);
          recolorVectors(icon, fg);
          place(c, icon);
          icon.visible = false;
          place(c, await text(style === 'Ghost' ? 'Отменить' : 'Связаться с нами', size === 'L' ? TS.buttonL : TS.button, fg, { name: 'Label' }));
          variants.push(c);
        }
      }
    }
    buttonSet = figma.combineAsVariants(variants, s);
    buttonSet.name = 'Button';
    variantGrid(buttonSet, 1100);
    buttonSet.description = 'Кнопки сайта: Primary (красная, «Связаться с нами», «Подписаться»), Outline («Направления деятельности», «Личный кабинет» с иконкой замка), Ghost («Отменить»).';
    const kLabel = buttonSet.addComponentProperty('Label', 'TEXT', 'Связаться с нами');
    const kShow = buttonSet.addComponentProperty('Show icon', 'BOOLEAN', false);
    const kIcon = buttonSet.addComponentProperty('Icon', 'INSTANCE_SWAP', I.Lock.id);
    for (const v of buttonSet.children) {
      const label = v.findOne(n => n.type === 'TEXT' && n.name === 'Label');
      const icon = v.findOne(n => n.type === 'INSTANCE' && n.name === 'Icon');
      if (label) label.componentPropertyReferences = { characters: kLabel };
      if (icon) icon.componentPropertyReferences = { visible: kShow, mainComponent: kIcon };
    }
  });

  /* ---------- Tag, Eyebrow, Spec chip ---------- */
  const X = {};
  await step('Tag / Eyebrow / Spec chip', async () => {
    const s = await section('Labels', 'Чип-тег новостей, моно-метка над H1 и чип спецификации узла схемы (выезжает при hover).');
    const row = frame('HORIZONTAL', 'Labels'); row.itemSpacing = 40; row.counterAxisAlignItems = 'CENTER';
    place(s, row);

    const tag = frame('HORIZONTAL', 'Tag', { component: true });
    pad(tag, 10, 4); radius(tag, R.full); fill(tag, C['surface/default']);
    place(tag, await text('Компания', TS.tag, C['text/primary'], { name: 'Label' }));
    tag.addComponentProperty('Label', 'TEXT', 'Компания');
    tag.findOne(n => n.type === 'TEXT').componentPropertyReferences = { characters: Object.keys(tag.componentPropertyDefinitions)[0] };
    tag.description = 'Рубрика новости';
    place(row, tag); X.tag = tag;

    const eb = frame('HORIZONTAL', 'Eyebrow', { component: true });
    eb.itemSpacing = 10; eb.counterAxisAlignItems = 'CENTER';
    const dot = figma.createRectangle(); dot.resize(6, 6); fill(dot, C['accent/default']); dot.name = 'Marker';
    place(eb, dot);
    place(eb, await text('АВТОМАТИЗАЦИЯ АЗС И НЕФТЕБАЗ · ТОМСК', TS.label, C['text/muted'], { name: 'Label' }));
    eb.addComponentProperty('Label', 'TEXT', 'АВТОМАТИЗАЦИЯ АЗС И НЕФТЕБАЗ · ТОМСК');
    eb.findOne(n => n.type === 'TEXT').componentPropertyReferences = { characters: Object.keys(eb.componentPropertyDefinitions)[0] };
    eb.description = 'Моно-метка hero';
    place(row, eb); X.eyebrow = eb;

    const chip = frame('HORIZONTAL', 'Spec chip', { component: true });
    fill(chip, C['bg/default']); stroke(chip, C['border/default']); radius(chip, R.sm);
    chip.clipsContent = true;
    await chip.setEffectStyleIdAsync(E.md.id);
    const bar = figma.createRectangle(); bar.name = 'Accent'; bar.resize(2, 10); fill(bar, C['accent/default']);
    place(chip, bar, { v: 'FILL' });
    const body = frame('VERTICAL', 'Body'); pad(body, 12, 10); body.itemSpacing = 2;
    place(chip, body);
    place(body, await text('ТРК-01 / ТРК-02', TS.caption, C['text/primary'], { name: 'Title' }));
    for (const line of ['Тип: заглушка', 'Рукава: 0 × 0', 'Интерфейс: —']) place(body, await text(line, TS.caption, C['text/muted']));
    chip.description = 'Появляется рядом с узлом схемы при hover/focus: opacity + translateY 6px, 180–220ms';
    place(row, chip); X.chip = chip;
  });

  /* ---------- Nav ---------- */
  await step('Nav item', async () => {
    const s = await section('Nav', 'Пункт главного меню, выпадающее меню (белая карточка, radius/md, мягкая тень, пункты каскадом 40ms) и шапка.');
    const variants = [];
    for (const [state, dd] of [['Default', 'No'], ['Hover', 'No'], ['Default', 'Yes'], ['Hover', 'Yes'], ['Open', 'Yes']]) {
      const c = figma.createComponent();
      c.name = `State=${state}, Dropdown=${dd}`;
      c.resize(120, 40);
      c.layoutMode = 'HORIZONTAL';
      c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
      c.counterAxisAlignItems = 'CENTER';
      pad(c, 14, 0); gap(c, 6); radius(c, R.full);
      fill(c, state === 'Default' ? null : C['surface/default']);
      place(c, await text(dd === 'Yes' ? 'О компании' : 'Новости', TS.nav, C['text/primary'], { name: 'Label' }));
      if (dd === 'Yes') {
        const ch = sizeIcon(I.Chevron.createInstance(), 14); ch.name = 'Chevron';
        recolorVectors(ch, C['text/muted']);
        if (state === 'Open') ch.rotation = 180;
        place(c, ch);
      }
      variants.push(c);
    }
    const set = figma.combineAsVariants(variants, s);
    set.name = 'Nav item';
    variantGrid(set, 760);
    set.description = 'Пункт меню шапки. Open — выпадающее меню раскрыто (aria-expanded="true").';
    const k = set.addComponentProperty('Label', 'TEXT', 'Новости');
    set.children.forEach(v => { const t = v.findOne(n => n.type === 'TEXT'); if (t) t.componentPropertyReferences = { characters: k }; });
    X.nav = set;

    // Dropdown item
    const dv = [];
    for (const state of ['Default', 'Hover']) {
      const c = figma.createComponent();
      c.name = `State=${state}`;
      c.resize(264, 44);
      c.layoutMode = 'HORIZONTAL';
      c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'AUTO';
      c.primaryAxisAlignItems = 'SPACE_BETWEEN'; c.counterAxisAlignItems = 'CENTER';
      pad(c, 12, 12); radius(c, R.sm);
      fill(c, state === 'Hover' ? C['bg/soft'] : null);
      place(c, await text('История компании', TS.small, C['text/primary'], { name: 'Label' }));
      const a = sizeIcon(I.Arrow.createInstance(), 16); a.name = 'Arrow';
      recolorVectors(a, state === 'Hover' ? C['accent/default'] : C['blueprint/line']);
      place(c, a);
      dv.push(c);
    }
    const ddSet = figma.combineAsVariants(dv, s);
    ddSet.name = 'Dropdown item';
    variantGrid(ddSet, 680);
    const kd = ddSet.addComponentProperty('Label', 'TEXT', 'История компании');
    ddSet.children.forEach(v => { const t = v.findOne(n => n.type === 'TEXT'); if (t) t.componentPropertyReferences = { characters: kd }; });
    X.ddItem = ddSet;

    // Dropdown menu
    const menu = frame('VERTICAL', 'Dropdown menu', { component: true });
    pad(menu, 8, 8); fill(menu, C['bg/default']); stroke(menu, C['border/default']); radius(menu, R.md);
    await menu.setEffectStyleIdAsync(E.md.id);
    const defItem = ddSet.children.find(v => v.name === 'State=Default');
    for (const label of ['Отдел по работе с клиентами', 'Администрация', 'Местоположение на карте']) {
      const inst = defItem.createInstance();
      place(menu, inst);
      inst.setProperties({ [kd]: label });
    }
    menu.description = 'Выпадающее меню «Контакты». Открытие по hover, клику и клавиатуре (Esc, стрелки).';
    place(s, menu);
    X.menu = menu;
  });

  /* ---------- Form ---------- */
  await step('Form', async () => {
    const s = await section('Form', 'Поле e-mail с плавающим лейблом, кастомный чекбокс (галочка прорисовывается). Ошибка валидации — поле «вздрагивает».');
    const iv = [];
    for (const state of ['Empty', 'Focus', 'Filled', 'Error']) {
      const c = figma.createComponent();
      c.name = `State=${state}`;
      c.layoutMode = 'VERTICAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO';
      gap(c, 6); c.fills = [];
      const field = frame('VERTICAL', 'Field');
      field.resize(460, 58);
      field.layoutMode = 'VERTICAL';
      field.primaryAxisSizingMode = 'FIXED'; field.counterAxisSizingMode = 'FIXED';
      field.primaryAxisAlignItems = 'CENTER';
      pad(field, 16, 0); field.itemSpacing = 2;
      fill(field, C['bg/default']); radius(field, R.md);
      stroke(field, state === 'Focus' ? C['text/primary'] : state === 'Error' ? C['accent/default'] : C['border/default'], 1.5);
      if (state === 'Focus') field.effects = [{ type: 'DROP_SHADOW', color: Object.assign(H('#D32F2F'), { a: 0.14 }), offset: { x: 0, y: 0 }, radius: 0, spread: 3, visible: true, blendMode: 'NORMAL', showShadowBehindNode: false }];
      place(c, field);
      const floated = state !== 'Empty';
      const lbl = await text('Электронная почта', TS.field, C['text/muted'], { name: 'Label' });
      if (floated) lbl.fontSize = 12;
      place(field, lbl);
      if (floated) place(field, await text(state === 'Focus' ? 'name@' : state === 'Error' ? 'name@company' : 'name@company.ru', TS.field, C['text/primary'], { name: 'Value' }));
      if (state === 'Error') place(c, await text('Проверьте адрес: в нём должны быть «@» и домен', TS.small, C['accent/hover'], { name: 'Error' }));
      iv.push(c);
    }
    const inSet = figma.combineAsVariants(iv, s);
    inSet.name = 'Input';
    variantGrid(inSet, 1100);
    inSet.description = 'Поле подписки. Лейбл «всплывает» при фокусе/заполнении: translateY -10px, scale 0.75.';

    const cv = [];
    for (const state of ['Unchecked', 'Checked', 'Error']) {
      const c = figma.createComponent();
      c.name = `State=${state}`;
      c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO';
      gap(c, 12); c.fills = [];
      const box = frame('HORIZONTAL', 'Box');
      box.resize(22, 22);
      box.primaryAxisSizingMode = 'FIXED'; box.counterAxisSizingMode = 'FIXED';
      box.primaryAxisAlignItems = 'CENTER'; box.counterAxisAlignItems = 'CENTER';
      box.cornerRadius = 6;
      if (state === 'Checked') { fill(box, C['accent/default']); stroke(box, C['accent/default'], 1.5); }
      else { fill(box, C['bg/default']); stroke(box, state === 'Error' ? C['accent/default'] : C['blueprint/line'], 1.5); }
      place(c, box);
      if (state === 'Checked') { const ck = sizeIcon(I.Check.createInstance(), 14); recolorVectors(ck, C['text/on-accent']); place(box, ck); }
      place(c, await text('Соглашаюсь получать рекламно-информационные сообщения', TS.small, C['text/muted'], { name: 'Label', width: 420 }));
      cv.push(c);
    }
    const ckSet = figma.combineAsVariants(cv, s);
    ckSet.name = 'Checkbox';
    variantGrid(ckSet, 1100);
    const kc = ckSet.addComponentProperty('Label', 'TEXT', 'Соглашаюсь получать рекламно-информационные сообщения');
    ckSet.children.forEach(v => { const t = v.findOne(n => n.type === 'TEXT'); if (t) t.componentPropertyReferences = { characters: kc }; });
  });

  /* ---------- Metric ---------- */
  await step('Metric', async () => {
    const s = await section('Metric', 'Ячейка метрики. Числа — заглушки (TODO в data-target на сайте), count-up с эффектом одометра.');
    const c = frame('VERTICAL', 'Metric', { component: true });
    c.resize(330, 180); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
    pad(c, 32, 48, 48, 44); // spacing/44 есть в коллекции gap(c, 8); fill(c, C['bg/default']);
    const num = frame('HORIZONTAL', 'Number'); num.counterAxisAlignItems = 'BASELINE'; num.itemSpacing = 2;
    place(c, num);
    place(num, await text('1200', TS.metric, C['text/primary'], { name: 'Value' }));
    const suf = await text('+', TS.metric, C['accent/default'], { name: 'Suffix' }); suf.fontSize = 46;
    place(num, suf);
    place(c, await text('объектов автоматизировано', TS.small, C['text/muted'], { name: 'Label' }));
    const kv = c.addComponentProperty('Value', 'TEXT', '1200');
    const ks = c.addComponentProperty('Suffix', 'TEXT', '+');
    const kl = c.addComponentProperty('Label', 'TEXT', 'объектов автоматизировано');
    c.findOne(n => n.name === 'Value').componentPropertyReferences = { characters: kv };
    c.findOne(n => n.name === 'Suffix').componentPropertyReferences = { characters: ks };
    c.findOne(n => n.name === 'Label').componentPropertyReferences = { characters: kl };
    c.description = 'Метрика: число Manrope 800 76px, суффикс красный.';
    place(s, c);
  });

  /* ---------- Direction card ---------- */
  await step('Direction card', async () => {
    const s = await section('Direction card', 'Карточка bento «Направления деятельности». Hover: рамка и стрелка краснеют, spotlight за курсором, tilt ≤ 4°, стрелка «уезжает» и возвращается.');
    const dv = [];
    for (const state of ['Default', 'Hover']) {
      const hot = state === 'Hover';
      const c = figma.createComponent();
      c.name = `State=${state}`;
      c.resize(312, 280);
      c.layoutMode = 'VERTICAL'; c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED';
      pad(c, 28, 28); gap(c, 10);
      fill(c, C['bg/default']); stroke(c, hot ? C['accent/default'] : C['border/default']); radius(c, R.lg);
      if (hot) await c.setEffectStyleIdAsync(E.md.id);
      const top = frame('HORIZONTAL', 'Top'); top.primaryAxisAlignItems = 'SPACE_BETWEEN'; top.counterAxisAlignItems = 'CENTER';
      place(c, top, { h: 'FILL' });
      place(top, await text('02', TS.label, C['text/muted'], { name: 'Number' }));
      const ic = sizeIcon(I.Code.createInstance(), 36); ic.name = 'Icon'; place(top, ic);
      const sp = frame(null, 'Spacer'); sp.resize(10, 14); place(c, sp);
      place(c, await text('Программное обеспечение', TS.h3, C['text/primary'], { name: 'Title', width: 256 }));
      place(c, await text('Текст-заглушка: краткое описание направления.', TS.small, C['text/muted'], { name: 'Text', width: 256 }));
      const grow = frame(null, 'Grow'); grow.resize(10, 10); place(c, grow, { v: 'FILL' });
      const foot = frame('HORIZONTAL', 'Footer'); foot.primaryAxisAlignItems = 'MAX';
      place(c, foot, { h: 'FILL' });
      const arrow = frame('HORIZONTAL', 'Arrow');
      arrow.resize(44, 44); arrow.primaryAxisSizingMode = 'FIXED'; arrow.counterAxisSizingMode = 'FIXED';
      arrow.primaryAxisAlignItems = 'CENTER'; arrow.counterAxisAlignItems = 'CENTER';
      radius(arrow, R.full); stroke(arrow, hot ? C['accent/default'] : C['border/default'], 1.5);
      const ai = sizeIcon(I.Arrow.createInstance(), 20); recolorVectors(ai, hot ? C['accent/default'] : C['text/primary']);
      place(arrow, ai); place(foot, arrow);
      dv.push(c);
    }
    const set = figma.combineAsVariants(dv, s);
    set.name = 'Direction card';
    variantGrid(set, 760);
    const kn = set.addComponentProperty('Number', 'TEXT', '02');
    const kt = set.addComponentProperty('Title', 'TEXT', 'Программное обеспечение');
    const kx = set.addComponentProperty('Text', 'TEXT', 'Текст-заглушка: краткое описание направления.');
    const ki = set.addComponentProperty('Icon', 'INSTANCE_SWAP', I.Code.id);
    set.children.forEach(v => {
      v.findOne(n => n.name === 'Number').componentPropertyReferences = { characters: kn };
      v.findOne(n => n.name === 'Title').componentPropertyReferences = { characters: kt };
      v.findOne(n => n.name === 'Text').componentPropertyReferences = { characters: kx };
      v.findOne(n => n.type === 'INSTANCE' && n.name === 'Icon').componentPropertyReferences = { mainComponent: ki };
    });
    set.description = 'Bento 12 колонок: «Оборудование для АЗС» 6 колонок × 2 ряда с мини-схемой, ПО и нефтебазы по 3, «Сеть АЗС» широкая, 6.';
  });

  /* ---------- News card ---------- */
  await step('News card', async () => {
    const s = await section('News card', 'Карточка ряда новостей: drag-scroll с инерцией на desktop, свайп на mobile, курсор «Тяни».');
    const c = figma.createComponent();
    c.name = 'News card';
    c.resize(360, 300);
    c.layoutMode = 'VERTICAL'; c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED';
    pad(c, 28, 28); fill(c, C['bg/default']); stroke(c, C['border/default']); radius(c, R.lg);
    const meta = frame('HORIZONTAL', 'Meta'); meta.primaryAxisAlignItems = 'SPACE_BETWEEN'; meta.counterAxisAlignItems = 'CENTER';
    place(c, meta, { h: 'FILL' });
    place(meta, await text('12.09.2026', TS.label, C['text/muted'], { name: 'Date' }));
    if (X.tag) place(meta, X.tag.createInstance());
    const sp = frame(null, 'Spacer'); sp.resize(10, 40); place(c, sp);
    place(c, await text('Заголовок новости-заглушки в две строки для проверки макета', TS.news, C['text/primary'], { name: 'Title', width: 304 }));
    const grow = frame(null, 'Grow'); grow.resize(10, 10); place(c, grow, { v: 'FILL' });
    place(c, await text('Читать', TS.button, C['text/muted'], { name: 'More' }));
    const kd = c.addComponentProperty('Date', 'TEXT', '12.09.2026');
    const kt = c.addComponentProperty('Title', 'TEXT', 'Заголовок новости-заглушки в две строки для проверки макета');
    c.findOne(n => n.name === 'Date').componentPropertyReferences = { characters: kd };
    c.findOne(n => n.name === 'Title').componentPropertyReferences = { characters: kt };
    c.description = 'Hover: рамка color/blueprint/line, «Читать» — color/accent/default.';
    place(s, c);
  });

  /* ---------- Header ---------- */
  await step('Header', async () => {
    const s = await section('Header', 'Шапка 88px, при скролле сжимается до 64px; сверху красная полоса прогресса чтения 2px. Фон белый с backdrop-blur.');
    const h = figma.createComponent();
    h.name = 'Header';
    h.resize(1440, 88);
    h.layoutMode = 'HORIZONTAL'; h.primaryAxisSizingMode = 'FIXED'; h.counterAxisSizingMode = 'FIXED';
    h.counterAxisAlignItems = 'CENTER'; h.primaryAxisAlignItems = 'SPACE_BETWEEN';
    pad(h, 60, 0); fill(h, C['bg/default']);
    h.strokes = [paint(C['border/default'])]; h.strokeWeight = 0; h.strokeBottomWeight = 1; h.strokeAlign = 'INSIDE';
    const brand = frame('HORIZONTAL', 'Brand'); brand.itemSpacing = 14; brand.counterAxisAlignItems = 'CENTER';
    place(h, brand);
    if (I.Monogram) { const m = sizeIcon(I.Monogram.createInstance(), 66); place(brand, m); }
    const bt = frame('VERTICAL', 'Brand text'); bt.itemSpacing = 2; bt.paddingLeft = 14;
    bt.strokes = [paint(C['border/default'])]; bt.strokeWeight = 0; bt.strokeLeftWeight = 1;
    place(brand, bt);
    place(bt, await text('Сибнефтекарт', TS.brand, C['text/primary']));
    place(bt, await text('акционерное общество «Научно-производственная фирма»', TS.brandSub, C['text/muted'], { width: 210 }));
    const right = frame('HORIZONTAL', 'Right'); right.itemSpacing = 32; right.counterAxisAlignItems = 'CENTER';
    place(h, right);
    const nav = frame('HORIZONTAL', 'Nav'); nav.itemSpacing = 4; nav.counterAxisAlignItems = 'CENTER';
    place(right, nav);
    if (X.nav) {
      const plain = X.nav.children.find(v => v.name === 'State=Default, Dropdown=No');
      const withDd = X.nav.children.find(v => v.name === 'State=Default, Dropdown=Yes');
      const key = Object.keys(X.nav.componentPropertyDefinitions).find(k => k.startsWith('Label'));
      for (const [label, dd] of [['Новости', false], ['О компании', true], ['Контакты', true], ['Сеть АЗС', false]]) {
        const inst = (dd ? withDd : plain).createInstance();
        place(nav, inst);
        inst.setProperties({ [key]: label });
      }
    }
    if (buttonSet) {
      const v = buttonSet.children.find(n => n.name === 'Style=Outline, Size=M, State=Default');
      const lk = v.createInstance();
      const defs = buttonSet.componentPropertyDefinitions;
      const kL = Object.keys(defs).find(k => k.startsWith('Label'));
      const kS = Object.keys(defs).find(k => k.startsWith('Show icon'));
      lk.setProperties({ [kL]: 'Личный кабинет', [kS]: true });
      place(right, lk);
    }
    const bar = figma.createRectangle(); bar.name = 'Reading progress'; bar.resize(420, 2); fill(bar, C['accent/default']);
    h.appendChild(bar); bar.layoutPositioning = 'ABSOLUTE'; bar.x = 0; bar.y = 0;
    h.description = 'Шапка сайта. Мобильная версия — бургер и полноэкранное светлое меню.';
    place(s, h);
  });

  /* =========================================================
     4. Foundations
     ========================================================= */
  await figma.setCurrentPageAsync(foundations);
  await step('Foundations', async () => {
    const root = frame('VERTICAL', 'Foundations');
    root.itemSpacing = 80; root.paddingLeft = root.paddingRight = root.paddingTop = root.paddingBottom = 80;
    fill(root, C['bg/default']);
    foundations.appendChild(root);
    place(root, await text('Foundations', TS.cta, C['text/primary']));
    place(root, await text('Токены главной страницы СНК. Строго светлая тема, красный — единственный акцент и используется дозированно. Кривая появлений cubic-bezier(0.22, 1, 0.36, 1), 400–900ms; UI-реакции ≤ 200ms.', TS.lead, C['text/muted'], { width: 900 }));

    // Цвета
    const colors = frame('VERTICAL', 'Color'); colors.itemSpacing = 24; place(root, colors);
    place(colors, await text('Color', TS.h2, C['text/primary']));
    const grid = frame('HORIZONTAL', 'Swatches'); grid.layoutWrap = 'WRAP'; grid.itemSpacing = 24; grid.counterAxisSpacing = 24;
    grid.resize(1280, 100); grid.primaryAxisSizingMode = 'FIXED'; grid.counterAxisSizingMode = 'AUTO';
    place(colors, grid);
    for (const [name, p, css] of SEM) {
      const card = frame('VERTICAL', name); card.itemSpacing = 8;
      place(grid, card);
      const sw = figma.createRectangle(); sw.resize(184, 96); sw.cornerRadius = 12;
      fill(sw, C[name.replace('color/', '')]); stroke(sw, C['border/default']);
      place(card, sw);
      place(card, await text(name, TS.caption, C['text/primary']));
      place(card, await text(`${PRIMS[p]} · var(${css})`, TS.caption, C['text/muted']));
    }

    // Типографика
    const type = frame('VERTICAL', 'Typography'); type.itemSpacing = 28; place(root, type);
    place(type, await text('Typography', TS.h2, C['text/primary']));
    place(type, await text('Manrope 500–800 с плотным трекингом для текста; JetBrains Mono — только метки на схеме, нумерация и даты.', TS.body, C['text/muted'], { width: 900 }));
    const samples = [
      ['h1', 'Оборудование и ПО для АЗС'], ['h2', 'Как работает система'], ['h3xl', 'Оборудование для АЗС'],
      ['h3', 'Программное обеспечение'], ['step', 'Хранение и учёт'], ['lead', 'Разрабатываем технику и программы для АЗС и нефтебаз.'],
      ['body', 'Основной текст, 17/1.6.'], ['small', 'Второстепенный текст, 15.5/1.55.'], ['button', 'Связаться с нами'],
      ['nav', 'О компании'], ['label', 'АВТОМАТИЗАЦИЯ АЗС И НЕФТЕБАЗ · ТОМСК'], ['caption', 'ТРК-01 · Р-02 · СРВ-01']
    ];
    for (const [k, sample] of samples) {
      const row = frame('HORIZONTAL', TS[k].name); row.itemSpacing = 40; row.counterAxisAlignItems = 'BASELINE';
      place(type, row);
      const meta = await text(`${TS[k].name}\n${TS[k].fontName.family} ${TS[k].fontName.style} · ${TS[k].fontSize}px`, TS.caption, C['text/muted'], { width: 260 });
      place(row, meta);
      place(row, await text(sample, TS[k], C['text/primary']));
    }

    // Spacing
    const spc = frame('VERTICAL', 'Spacing'); spc.itemSpacing = 12; place(root, spc);
    place(spc, await text('Spacing', TS.h2, C['text/primary']));
    for (const n of [4, 8, 12, 16, 24, 32, 48, 64, 88, 120]) {
      const row = frame('HORIZONTAL', `spacing/${n}`); row.itemSpacing = 24; row.counterAxisAlignItems = 'CENTER';
      place(spc, row);
      const l = await text(`spacing/${n}`, TS.caption, C['text/muted'], { width: 120 }); place(row, l);
      const b = figma.createRectangle(); b.resize(n, 16); fill(b, C['accent/default']); place(row, b);
    }

    // Radius + shadows
    const rs = frame('VERTICAL', 'Radius & Shadow'); rs.itemSpacing = 24; place(root, rs);
    place(rs, await text('Radius & Shadow', TS.h2, C['text/primary']));
    const rrow = frame('HORIZONTAL', 'Radii'); rrow.itemSpacing = 32; place(rs, rrow);
    for (const k of ['sm', 'md', 'lg', 'full']) {
      const cell = frame('VERTICAL', `radius/${k}`); cell.itemSpacing = 8; place(rrow, cell);
      const b = figma.createRectangle(); b.resize(120, 80); fill(b, C['surface/default']); stroke(b, C['blueprint/line']);
      ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'].forEach(f => b.setBoundVariable(f, R[k]));
      place(cell, b);
      place(cell, await text(`radius/${k}`, TS.caption, C['text/muted']));
    }
    const srow = frame('HORIZONTAL', 'Shadows'); srow.itemSpacing = 32; srow.paddingTop = 16; place(rs, srow);
    for (const e of [E.sm, E.md]) {
      const cell = frame('VERTICAL', e.name); cell.itemSpacing = 12; place(srow, cell);
      const b = figma.createRectangle(); b.resize(200, 100); b.cornerRadius = 12; fill(b, C['bg/default']);
      await b.setEffectStyleIdAsync(e.id);
      place(cell, b);
      place(cell, await text(e.name, TS.caption, C['text/muted']));
    }
  });

  /* =========================================================
     5. Cover
     ========================================================= */
  await figma.setCurrentPageAsync(cover);
  await step('Cover', async () => {
    const f = frame('VERTICAL', 'Cover');
    f.resize(1440, 960);
    f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED';
    f.primaryAxisAlignItems = 'CENTER';
    pad(f, 120, 0); f.itemSpacing = 28;
    fill(f, C['bg/default']);
    cover.appendChild(f);
    if (I.Monogram) { const m = sizeIcon(I.Monogram.createInstance(), 240); place(f, m); }
    place(f, await text('Сибнефтекарт · UI kit', TS.cta, C['text/primary']));
    place(f, await text('Главная страница: концепция «Живая схема». Токены, стили и компоненты совпадают с designs/styles.css.', TS.lead, C['text/muted'], { width: 900 }));
    place(f, await text('Страницы: Главная · 1440 (снимок сайта) → Foundations → Components', TS.label, C['text/muted']));
    if (errors.length) {
      place(f, await text(`Сборка завершилась с замечаниями (${errors.length}):\n${errors.join('\n')}`, TS.caption, C['accent/hover'], { width: 1100 }));
    }
  });

  figma.closePlugin(errors.length ? `UI kit собран с замечаниями: ${errors.length} (см. страницу Cover)` : 'UI kit собран: Cover, Foundations, Components');
})().catch(e => figma.closePlugin(`Ошибка сборки UI kit: ${(e && e.message) || e}`));
