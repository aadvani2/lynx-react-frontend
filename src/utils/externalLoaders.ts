type LoadMap = Map<string, Promise<void>>;

const scriptPromises: LoadMap = new Map();
const stylePromises: LoadMap = new Map();

const ensureGlobalJquery = () => {
  const w = window as any;
  if (!w.$ && w.jQuery) {
    w.$ = w.jQuery;
  }
};

const loadScriptOnce = (id: string, src: string): Promise<void> => {
  if (scriptPromises.has(id)) return scriptPromises.get(id)!;

  const promise = new Promise<void>((resolve, reject) => {
    // If script tag already present, resolve immediately
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing?.dataset.loaded === 'true') {
      resolve();
      return;
    }

    const script = existing || document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.dataset.loaded = 'false';
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = (err) => reject(err);
    if (!existing) document.head.appendChild(script);
  });

  scriptPromises.set(id, promise);
  return promise;
};

const loadStyleOnce = (id: string, href: string): Promise<void> => {
  if (stylePromises.has(id)) return stylePromises.get(id)!;

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLLinkElement>(`link[href="${href}"]`);
    if (existing?.dataset.loaded === 'true') {
      resolve();
      return;
    }

    const link = existing || document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.loaded = 'false';
    link.onload = () => {
      link.dataset.loaded = 'true';
      resolve();
    };
    link.onerror = (err) => reject(err);
    if (!existing) document.head.appendChild(link);
  });

  stylePromises.set(id, promise);
  return promise;
};

export const loadJquery = async () => {
  await loadScriptOnce('jquery-cdn', 'https://code.jquery.com/jquery-3.6.0.min.js');
  ensureGlobalJquery();
};

export const loadSelect2 = async () => {
  await loadJquery();
  await Promise.all([
    loadStyleOnce('select2-css', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css'),
    loadStyleOnce('select2-overrides-css', '/css/select2-overrides.css'),
    loadScriptOnce('select2-js', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js'),
  ]);
  ensureGlobalJquery();
};

export const loadSummernote = async () => {
  await loadSelect2();
  await Promise.all([
    loadStyleOnce('summernote-css', 'https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-bs5.min.css'),
    loadScriptOnce('summernote-js', 'https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-bs5.min.js'),
  ]);
  ensureGlobalJquery();
};

export const loadQuill = async () => {
  await loadStyleOnce('quill-css', 'https://cdn.quilljs.com/1.3.6/quill.snow.css');
  await loadScriptOnce('quill-js', 'https://cdn.quilljs.com/1.3.6/quill.min.js');
};

export const loadTwilioChat = async () => {
  await loadScriptOnce('twilio-chat', 'https://media.twiliocdn.com/sdk/js/chat/v3.3/twilio-chat.min.js');
};
