// State
let caseStudies = [];
let currentCategory = 'all';
let userEmail = 'saitara.ux@gmail.com';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupEventListeners();
  checkDatabaseHealth();
  setInterval(checkDatabaseHealth, 30000);
});

async function initApp() {
  await Promise.all([
    fetchProfile(),
    fetchCaseStudies('all')
  ]);
}

// Fetch Profile from MongoDB
async function fetchProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Failed to load profile');
    const profile = await res.json();
    userEmail = profile.email || 'saitara.ux@gmail.com';

    // Update dynamic text
    const emailEls = document.querySelectorAll('.dynamic-email');
    emailEls.forEach(el => el.textContent = userEmail);

    const nameEls = document.querySelectorAll('.dynamic-name');
    nameEls.forEach(el => el.textContent = profile.name);

    const roleEls = document.querySelectorAll('.dynamic-role');
    roleEls.forEach(el => el.textContent = profile.roleTitle);
  } catch (err) {
    console.error('Error fetching profile:', err);
  }
}

// Fetch Case Studies from MongoDB
async function fetchCaseStudies(category = 'all') {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-dim);">
      <div class="status-dot" style="margin: 0 auto 12px; width: 14px; height: 14px;"></div>
      กำลังโหลดผลงาน Case Studies จากฐานข้อมูล MongoDB Atlas... ✨
    </div>
  `;

  try {
    const url = category === 'all' ? '/api/case-studies' : `/api/case-studies?category=${category}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load case studies');
    caseStudies = await res.json();
    renderCaseStudies(caseStudies);
  } catch (err) {
    console.warn('Network issue fetching case studies, attempting fallback...', err);
    // If caseStudies was already loaded, filter it
    if (caseStudies && caseStudies.length > 0) {
      const filtered = category === 'all' ? caseStudies : caseStudies.filter(s => s.category === category);
      renderCaseStudies(filtered);
    } else {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-dim);">
          <div class="status-dot" style="margin: 0 auto 10px; background: #f59e0b;"></div>
          กำลังโหลดข้อมูลผลงาน... กรุณารอสักครู่หรือรีเฟรชหน้าเว็บนะคะ ✨
        </div>
      `;
    }
  }
}

// Render Case Studies Grid
function renderCaseStudies(items) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-dim);">
        ยังไม่มีผลงานในหมวดหมู่นี้ค่ะ ✨
      </div>
    `;
    return;
  }

  container.innerHTML = items.map((study) => {
    const topMetric = study.keyMetrics && study.keyMetrics[0] ? study.keyMetrics[0] : null;
    const secondMetric = study.keyMetrics && study.keyMetrics[1] ? study.keyMetrics[1] : null;

    return `
      <article class="project-card" data-slug="${study.slug}">
        <div class="card-visual">
          <span class="card-category-badge">${study.categoryLabel}</span>
          <div class="card-role-tags">
            ${(study.roleTags && study.roleTags.length > 0 ? study.roleTags : ['UX Research', 'UI Design']).map(tag => {
              const tagClass = tag.toLowerCase().includes('research') ? 'tag-research' : 'tag-design';
              const icon = tag.toLowerCase().includes('research') ? '🔍' : '🎨';
              return `<span class="card-role-tag ${tagClass}">${icon} ${tag}</span>`;
            }).join('')}
          </div>
          
          <div class="card-mockup-art">
            <div class="mock-bar accent"></div>
            <div class="mock-bar" style="width: 80%;"></div>
            <div class="mock-bar" style="width: 50%;"></div>
            <div class="mock-grid">
              <div class="mock-box"></div>
              <div class="mock-box"></div>
              <div class="mock-box" style="background: rgba(34, 197, 94, 0.25);"></div>
            </div>
          </div>
        </div>

        <div class="card-body">
          <h3 class="card-title">${study.title}</h3>
          <p class="card-tagline">${study.tagline}</p>

          <!-- 60-Second Recruiter Snapshot -->
          <div class="executive-box">
            <div class="exec-item">
              <span class="exec-label">ปัญหา:</span>
              <span class="exec-text">${escapeHtml(truncate(study.executiveSummary.problem, 120))}</span>
            </div>
            <div class="exec-item">
              <span class="exec-label" style="color: #4ade80;">ผลลัพธ์:</span>
              <span class="exec-text" style="color: #4ade80; font-weight: 600;">${escapeHtml(study.executiveSummary.impact)}</span>
            </div>
          </div>

          <!-- Key Metrics Badges -->
          <div class="card-metrics-strip">
            ${topMetric ? `<span class="metric-pill">📈 ${topMetric.label}: <strong>${topMetric.value}</strong></span>` : ''}
            ${secondMetric ? `<span class="metric-pill">⚡ ${secondMetric.label}: <strong>${secondMetric.value}</strong></span>` : ''}
          </div>

          <div class="card-footer">
            <div class="card-tools">
              ${(study.tools || []).slice(0, 3).map(tool => `<span class="tool-badge">${tool}</span>`).join('')}
            </div>

            <button class="btn btn-3d-secondary" onclick="openCaseStudyModal('${study.slug}')" style="padding: 8px 16px; font-size: 0.85rem;">
              อ่านเคสสตัดดี้ฉบับเต็ม ➔
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Open In-Depth Case Study Modal
function openCaseStudyModal(slug) {
  if (typeof GameAudio !== 'undefined') GameAudio.playChime();
  const study = caseStudies.find(s => s.slug === slug);
  if (!study) return;

  const modalBody = document.getElementById('caseStudyModalBody');
  const modalTitle = document.getElementById('caseStudyModalTitle');
  if (!modalBody || !modalTitle) return;

  modalTitle.textContent = study.title;

  modalBody.innerHTML = `
    <div class="cs-header-meta">
      <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; align-items: center;">
        <span style="background: rgba(34, 197, 94, 0.15); color: #4ade80; padding: 5px 14px; border-radius: 9999px; font-size: 0.82rem; font-weight: 700;">
          ${study.categoryLabel}
        </span>
        <span style="font-size: 0.85rem; color: var(--text-dim); padding: 4px 0;">
          ⏱ ระยะเวลา: ${study.timeline} • 👥 ทีม: ${study.team}
        </span>
      </div>
      <p style="font-size: 1.15rem; color: var(--text-main); font-weight: 600; line-height: 1.6;">
        ${study.tagline}
      </p>

      <!-- App Linking Bar (วิธีลิงก์ผลงานแอพไปยังภายนอก) -->
      <div style="display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
        <a href="https://www.figma.com" target="_blank" rel="noopener" class="btn btn-3d-secondary" style="padding: 8px 16px; font-size: 0.84rem;">
          🎨 กดลองเล่น Prototype บน Figma ↗
        </a>
        <a href="https://framer.com" target="_blank" rel="noopener" class="btn btn-3d-secondary" style="padding: 8px 16px; font-size: 0.84rem;">
          📱 ดู Live Web App Demo ↗
        </a>
      </div>
    </div>

    <!-- Metrics Bento Strip -->
    <div class="cs-metric-grid">
      ${(study.keyMetrics || []).map(m => `
        <div class="cs-metric-item">
          <div class="cs-metric-num">${m.value}</div>
          <div style="font-weight: 700; font-size: 0.82rem; color: var(--text-main); margin-top: 3px;">${m.label}</div>
          <div class="cs-metric-desc">${m.context || ''}</div>
        </div>
      `).join('')}
    </div>

    ${study.liveUrl ? `
      <!-- Embedded Live Interactive App Viewer -->
      <div style="margin-bottom: 1.5rem; background: #070d18; border: 2px solid #10b981; border-radius: 16px; padding: 14px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <span style="font-weight: 800; color: #4ade80; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px;">
            <span class="status-dot-pulse"></span> 📱 ทดลองเล่นแอปจริง (Live App Interactive Simulator)
          </span>
          <a href="${study.liveUrl}" target="_blank" rel="noopener noreferrer" style="color: #facc15; font-size: 0.85rem; font-weight: 700; text-decoration: underline;">
            เปิดแอปเต็มจอในแท็บใหม่ ➔
          </a>
        </div>
        <div style="width: 100%; height: 520px; border-radius: 12px; overflow: hidden; background: #fff;">
          <iframe src="${study.liveUrl}" style="width: 100%; height: 100%; border: none;" title="Live Interactive App" loading="lazy" allow="geolocation"></iframe>
        </div>
      </div>
    ` : ''}

    <!-- Section 1: สรุปเร็ว 60 วินาที -->
    <div class="cs-section" style="background: rgba(34, 197, 94, 0.06); border: 1.5px solid rgba(34, 197, 94, 0.25); border-radius: var(--radius-md); padding: 1.35rem;">
      <h4 style="color: #4ade80; font-size: 1rem; font-weight: 800; margin-bottom: 8px;">
        ⚡ สรุปเร็วใน 60 วินาที (สำหรับ Recruiter & Hiring Manager)
      </h4>
      <p style="font-size: 0.94rem; color: var(--text-muted); margin-bottom: 8px; line-height: 1.6;">
        <strong>ปัญหาที่พบ:</strong> ${escapeHtml(study.executiveSummary.problem)}
      </p>
      <p style="font-size: 0.94rem; color: var(--text-muted); margin-bottom: 8px; line-height: 1.6;">
        <strong>วิธีแก้ปัญหา UX:</strong> ${escapeHtml(study.executiveSummary.solution)}
      </p>
      <p style="font-size: 0.94rem; color: #4ade80; line-height: 1.6;">
        <strong>ผลลัพธ์ทางธุรกิจ:</strong> ${escapeHtml(study.executiveSummary.impact)}
      </p>
    </div>

    <!-- Section 2: ค้นหาปัญหาและทำความเข้าใจผู้ใช้ -->
    <div class="cs-section">
      <h4 class="cs-section-title">🔍 1. การค้นพบปัญหาและการวิจัยผู้ใช้ (Discovery & Research)</h4>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 12px; line-height: 1.65;">
        ${escapeHtml(study.discovery.challenge || '')}
      </p>

      ${study.discovery.userPersona ? `
        <div class="cs-persona-card">
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem; margin-bottom: 6px;">
            👤 ตัวแทนผู้ใช้งานหลัก (Persona): ${study.discovery.userPersona.name} (${study.discovery.userPersona.role})
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 0.88rem; margin-top: 10px;">
            <div>
              <strong style="color: #4ade80;">ความต้องการหลัก (User Needs):</strong>
              <ul style="padding-left: 18px; margin-top: 6px; color: var(--text-muted); line-height: 1.55;">
                ${study.discovery.userPersona.needs.map(n => `<li>${n}</li>`).join('')}
              </ul>
            </div>
            <div>
              <strong style="color: var(--accent-coral);">จุดติดขัด & อุปสรรค (Pain Points):</strong>
              <ul style="padding-left: 18px; margin-top: 6px; color: var(--text-muted); line-height: 1.55;">
                ${study.discovery.userPersona.painPoints.map(p => `<li>${p}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 14px;">
        <strong style="font-size: 0.92rem; color: var(--text-main);">ข้อค้นพบสำคัญจากการวิจัย (Research Insights):</strong>
        <ul style="padding-left: 20px; font-size: 0.92rem; color: var(--text-muted); margin-top: 6px; line-height: 1.65;">
          ${(study.discovery.researchInsights || []).map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    </div>

    <!-- Section 3: สถาปัตยกรรมข้อมูลและกลยุทธ์ -->
    <div class="cs-section">
      <h4 class="cs-section-title">📐 2. การจัดระเบียบข้อมูลและขั้นตอน (Information Architecture & Flow)</h4>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 12px;">
        ลดภาระทางความคิด (Cognitive Load) และกำจัดทางตัน (No Dead Ends) ในการใช้งาน:
      </p>
      
      <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1.2rem; border: 1px solid var(--border-subtle); margin-bottom: 14px;">
        <strong style="font-size: 0.88rem; color: var(--accent-sky); display: block; margin-bottom: 8px;">
          ลำดับเส้นทางการใช้งานใหม่ (Optimized User Journey Steps)
        </strong>
        <ol style="padding-left: 22px; font-size: 0.92rem; color: var(--text-muted); line-height: 1.65;">
          ${(study.strategy.userFlowSteps || []).map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>

      <div>
        <strong style="font-size: 0.92rem; color: var(--text-main);">จุดปรับปรุงแบบ Fast-Track ที่เห็นผลทันที:</strong>
        <ul style="padding-left: 20px; font-size: 0.92rem; color: var(--text-muted); margin-top: 6px; line-height: 1.65;">
          ${(study.strategy.fastTrackWins || []).map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>
    </div>

    <!-- Section 4: ความประณีตในงาน UI -->
    <div class="cs-section">
      <h4 class="cs-section-title">✨ 3. ความประณีตในงานดีไซน์ (UI Craftsmanship & Micro-Interactions)</h4>
      <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 12px;">
        <strong>การเลือกใช้ฟอนต์และ Accessibility:</strong> ${study.craftsmanship.typography || 'ฟอนต์ Prompt และ Plus Jakarta Sans รองรับ WCAG 2.1 AA'}
      </p>

      <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
        <span style="font-size: 0.88rem; font-weight: 600; color: var(--text-dim);">ชุดสีผ่านเกณฑ์คอนทราสต์:</span>
        ${(study.craftsmanship.colorPalette || []).map(c => `
          <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 4px 10px; font-size: 0.8rem;">
            <span style="width: 14px; height: 14px; border-radius: 4px; background: ${c.hex}; display: inline-block;"></span>
            <span>${c.name}</span>
          </div>
        `).join('')}
      </div>

      <div class="screen-grid">
        ${(study.craftsmanship.screens || []).map(sc => `
          <div class="screen-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="font-size: 0.94rem; color: var(--text-main);">${sc.title}</strong>
              <span style="font-size: 0.75rem; padding: 3px 10px; border-radius: 9999px; background: rgba(34, 197, 94, 0.15); color: #4ade80;">
                ${sc.badge || 'Screen'}
              </span>
            </div>
            <p style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.5;">
              ${sc.description}
            </p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Section 5: ผลลัพธ์และสิ่งที่ได้เรียนรู้ -->
    <div class="cs-section">
      <h4 class="cs-section-title">🚀 4. ผลลัพธ์ทางธุรกิจและบทเรียน (Outcomes & Retrospective)</h4>
      <ul style="padding-left: 20px; font-size: 0.94rem; color: var(--text-main); line-height: 1.65; margin-bottom: 14px;">
        ${(study.impact.outcomes || []).map(out => `<li style="margin-bottom: 6px;">${out}</li>`).join('')}
      </ul>
      <div style="background: rgba(255, 255, 255, 0.04); border-radius: var(--radius-md); padding: 1.2rem; border: 1px solid var(--border-subtle);">
        <strong style="font-size: 0.88rem; color: var(--accent-mint);">บทเรียนที่ได้จากโปรเจกต์นี้:</strong>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px; line-height: 1.55;">
          ${study.impact.learnings || ''}
        </p>
      </div>
    </div>

    <!-- Modal Footer Actions -->
    <div style="margin-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <button class="btn btn-3d-primary" onclick="copyEmailToClipboard(this)">
        📩 สนใจพูดคุยเกี่ยวกับโปรเจกต์นี้
      </button>
      <button class="btn btn-3d-secondary" onclick="closeAllModals()">
        ปิดหน้าต่าง
      </button>
    </div>
  `;

  document.getElementById('caseStudyModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Copy Email Micro-interaction
async function copyEmailToClipboard(triggerBtn) {
  try {
    await navigator.clipboard.writeText(userEmail);
    showToast('✨ คัดลอกอีเมลเรียบร้อยแล้วค่ะ! (' + userEmail + ') 💖');
    
    // Update trigger button
    if (triggerBtn) {
      const originalText = triggerBtn.innerHTML;
      triggerBtn.classList.add('copied');
      triggerBtn.innerHTML = '✓ คัดลอกแล้วค่ะ!';
      setTimeout(() => {
        triggerBtn.classList.remove('copied');
        triggerBtn.innerHTML = originalText;
      }, 2500);
    }

    // Update all copy buttons
    const allCopyBtns = document.querySelectorAll('.btn-copy-email');
    allCopyBtns.forEach(btn => {
      btn.classList.add('copied');
      btn.innerHTML = '✓ คัดลอกแล้วค่ะ!';
    });
    setTimeout(() => {
      allCopyBtns.forEach(btn => {
        btn.classList.remove('copied');
        btn.innerHTML = '📋 คัดลอกอีเมล';
      });
    }, 2500);
  } catch (err) {
    showToast('อีเมล: ' + userEmail);
  }
}

// Toast Feedback System
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  toast.offsetHeight;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Resume Preview Modal Trigger
function openResumeModal() {
  if (typeof GameAudio !== 'undefined') GameAudio.playChime();
  document.getElementById('resumeModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Recruiter Messages / Admin Modal Trigger
async function openMessagesModal() {
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();
  const container = document.getElementById('messagesContainer');
  if (!container) return;

  container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-dim);">กำลังดึงข้อความจาก MongoDB Atlas... ✨</div>';
  document.getElementById('messagesModal').classList.add('open');
  document.body.style.overflow = 'hidden';

  try {
    const res = await fetch('/api/messages');
    const messages = await res.json();

    if (messages.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2.5rem; color: var(--text-dim);">
          ยังไม่มีข้อความส่งเข้ามาค่ะ ✨<br>
          <span style="font-size: 0.88rem; color: var(--text-muted);">คุณสามารถทดลองพิมพ์ส่งข้อความจากฟอร์มด้านล่างได้เลยนะคะ!</span>
        </div>
      `;
      return;
    }

    container.innerHTML = messages.map(m => `
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
          <strong style="color: var(--text-main); font-size: 0.98rem;">${escapeHtml(m.name)} (${escapeHtml(m.role)})</strong>
          <span style="font-size: 0.78rem; color: var(--text-dim);">${new Date(m.createdAt).toLocaleDateString('th-TH')}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--accent-mint); margin-bottom: 6px;">
          🏢 ${escapeHtml(m.company)} • ✉️ ${escapeHtml(m.email)}
        </div>
        <div style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.5; background: rgba(0,0,0,0.25); padding: 10px 14px; border-radius: var(--radius-sm);">
          "${escapeHtml(m.message)}"
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<div style="color: var(--accent-coral); padding: 1rem;">เกิดข้อผิดพลาดในการโหลดข้อความ</div>';
  }
}

// Close All Modals
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('open');
  });
  document.body.style.overflow = '';
}

// Check Database Connection Health
async function checkDatabaseHealth() {
  const pill = document.getElementById('dbStatusPill');
  if (!pill) return;

  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    if (data.database === 'connected') {
      pill.innerHTML = '<span class="status-dot"></span> MongoDB ออนไลน์พร้อมใช้งาน ✨';
      pill.style.borderColor = 'rgba(34, 197, 94, 0.35)';
      pill.style.color = '#4ade80';
    } else {
      pill.innerHTML = '<span class="status-dot" style="background: #f59e0b;"></span> กำลังเชื่อมต่อ DB...';
    }
  } catch (err) {
    pill.innerHTML = '<span class="status-dot" style="background: #f43f5e;"></span> DB ออฟไลน์';
  }
}

// Switch Natia Resume Tabs (About Me, Experience, Education, Skills)
function switchResumeTab(tabName) {
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();
  const buttons = document.querySelectorAll('.resume-tab-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });

  const panes = document.querySelectorAll('.resume-tab-pane');
  panes.forEach(pane => {
    pane.classList.toggle('active', pane.id === 'tab-' + tabName);
  });
}

// Event Listeners setup
function setupEventListeners() {
  // Category filter tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      fetchCaseStudies(cat);
    });
  });

  // Resume Tabs
  const resumeTabBtns = document.querySelectorAll('.resume-tab-btn');
  resumeTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = btn.getAttribute('data-tab');
      if (tabName) switchResumeTab(tabName);
    });
  });

  // Contact Form Submission (Real MongoDB Save)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'กำลังส่งข้อมูลเข้าสู่ MongoDB... ⏳';

      const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        company: document.getElementById('contactCompany').value,
        role: document.getElementById('contactRole').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await res.json();

        if (res.ok && result.success) {
          showToast('🚀 ส่งข้อความสำเร็จ! บันทึกข้อมูลลง MongoDB เรียบร้อยแล้วค่ะ');
          contactForm.reset();
          submitBtn.innerHTML = '✓ ส่งข้อความเรียบร้อยแล้วค่ะ! 💖';
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }, 3000);
        } else {
          showToast('⚠️ ข้อผิดพลาด: ' + (result.error || 'ไม่สามารถส่งข้อความได้'));
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      } catch (err) {
        showToast('⚠️ เกิดข้อผิดพลาดของเครือข่าย');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Keyboard shortcut ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Close modals on clicking overlay background
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '...' : str;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// GAME AUDIO & CARTOON INTERACTION ENGINE
// ==========================================

const GameAudio = {
  ctx: null,
  muted: false,
  init() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch(e) {}
  },
  playChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const startTime = this.ctx.currentTime + idx * 0.06;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    } catch(e) {}
  },
  playBoing() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(580, this.ctx.currentTime + 0.12);
      osc.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.23);
    } catch(e) {}
  }
};

function toggleGameSFX() {
  GameAudio.muted = !GameAudio.muted;
  const icon = document.getElementById('sfxIcon');
  const label = document.getElementById('sfxLabel');
  if (icon && label) {
    icon.textContent = GameAudio.muted ? '🔇' : '🔊';
    label.textContent = GameAudio.muted ? 'SFX ปิด' : 'SFX เปิด';
  }
  if (!GameAudio.muted) {
    GameAudio.playPop();
  }
}

// Cartoon Avatar Speech Dialogue
const avatarDialogue = [
  "สวัสดีค่า! ฉันชื่อสายธาร ยินดีที่ได้พบกันนะคะ 💖",
  "ปัจจุบันประจำการอยู่ที่ Security Pitch ค่ะ! 🛡️",
  "สะสมประสบการณ์ UI/UX & Code มากว่า 5 ปีแล้วน้า ⚔️",
  "Figma คืออาวุธหลักขั้นเทพที่ฉันรักที่สุดเลยค่ะ! 🎨",
  "สามารถคลิกดูสำรับผลงานและ Case Studies ได้เลยนะค้า ✨",
  "พร้อมตอบรับโอกาสและคุยโปรเจกต์ใหม่เสมอค่ะ! 🚀"
];
let currentDialogueIdx = 0;

function pokeAvatar() {
  GameAudio.playBoing();
  const bubble = document.getElementById('avatarSpeechBubble');
  const textEl = document.getElementById('bubbleText');
  if (!bubble || !textEl) return;

  currentDialogueIdx = (currentDialogueIdx + 1) % avatarDialogue.length;
  textEl.textContent = avatarDialogue[currentDialogueIdx];
  bubble.style.display = 'block';
  bubble.style.animation = 'none';
  bubble.offsetHeight;
  bubble.style.animation = 'speechPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
}

// ==========================================
// ADVENTURE MINIMAP (FLOATING TOUR NAVIGATOR)
// ==========================================
function toggleMinimap() {
  const minimap = document.getElementById('adventureMinimap');
  const icon = document.getElementById('minimapToggleIcon');
  if (!minimap) return;
  minimap.classList.toggle('collapsed');
  if (icon) {
    icon.textContent = minimap.classList.contains('collapsed') ? '🗺️' : '−';
  }
}

function handleMinimapClick(e, target) {
  if (e) e.preventDefault();
  GameAudio.playPop();

  if (target === 'hero') {
    const el = document.getElementById('hero');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (target === 'deck') {
    const el = document.getElementById('deck');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (target === 'skills') {
    const el = document.getElementById('resume');
    if (typeof switchResumeTab === 'function') switchResumeTab('skills');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (target === 'experience') {
    const el = document.getElementById('resume');
    if (typeof switchResumeTab === 'function') switchResumeTab('experience');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (target === 'contact') {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateMinimapActiveState() {
  const nodes = document.querySelectorAll('.minimap-node');
  const scrollPos = window.scrollY + window.innerHeight * 0.35;

  const heroSec = document.getElementById('hero');
  const deckSec = document.getElementById('deck');
  const resumeSec = document.getElementById('resume');
  const contactSec = document.getElementById('contact');

  let activeTarget = 'hero';

  if (contactSec && scrollPos >= contactSec.offsetTop) {
    activeTarget = 'contact';
  } else if (resumeSec && scrollPos >= resumeSec.offsetTop) {
    const activeTab = document.querySelector('.resume-tab-pane.active');
    if (activeTab && activeTab.id === 'tab-skills') {
      activeTarget = 'skills';
    } else {
      activeTarget = 'experience';
    }
  } else if (deckSec && scrollPos >= deckSec.offsetTop) {
    activeTarget = 'deck';
  } else {
    activeTarget = 'hero';
  }

  nodes.forEach(node => {
    node.classList.toggle('active', node.getAttribute('data-target') === activeTarget);
  });
}

window.addEventListener('scroll', updateMinimapActiveState, { passive: true });

// ==========================================
// GUIDED TOUR SYSTEM
// ==========================================
const tourSteps = [
  {
    targetId: 'hero',
    badge: '🚩 สถานีที่ 1 / 5 · จุดสตาร์ต',
    title: 'ยินดีต้อนรับสู่ทัวร์ผลงานของสายธาร! 👋',
    desc: 'สวัสดีค่ะ! จุดนี้คือภาพรวมโปรไฟล์และระดับประสบการณ์ ทำงานในตำแหน่ง UI/UX Designer & Developer ที่ Security Pitch มากว่า 5 ปี 9 เดือน',
    btnLabel: 'ดูสำรับผลงานถัดไป ➔',
    tab: null
  },
  {
    targetId: 'deck',
    badge: '🃏 สถานีที่ 2 / 5 · สำรับการ์ดเคสสตัดดี้',
    title: 'สำรับการ์ดเคสสตัดดี้เด่น (Adventure Deck)',
    desc: 'จุดนี้รวบรวมผลงานเด่น เช่น FlowPay FinTech (ลดขั้นตอน KYC สำเร็จ +38.4%) และ NovaCloud Enterprise ที่สายธารออกแบบ Design System ลองคลิกการ์ดเพื่อส่องดูได้เลยค่ะ',
    btnLabel: 'ไปส่องคลังสกิล ➔',
    tab: null
  },
  {
    targetId: 'resume',
    badge: '🛠️ สถานีที่ 3 / 5 · คลังอาวุธสกิล',
    title: 'คลังอุปกรณ์ Figma, Ai, Pr & Dev',
    desc: 'สายธารเชี่ยวชาญ Figma ระดับ Core Tool ทั้ง Tokens, Auto-Layout, Component Libraries และใช้ Adobe Ai, Pr รวมถึงเขียนโค้ด Front-End เชื่อมโยงงานดีไซน์กับ Developer ได้จริง',
    btnLabel: 'ดูประวัติการทำงาน ➔',
    tab: 'skills'
  },
  {
    targetId: 'resume',
    badge: '📜 สถานีที่ 4 / 5 · บันทึกการเดินทาง',
    title: 'ประสบการณ์ทำงาน 5+ ปี & 4 องค์กรฝึกงาน',
    desc: 'บันทึกการเดินทางจริง ทั้งงานประจำที่ Security Pitch และประวัติการฝึกงานตั้งแต่ กองปราบปราม, มูลนิธิ Connext ED, ThaiNews ไปจนถึง 7-Eleven ในระบบ PIM Work-based Learning',
    btnLabel: 'สถานีสุดท้าย: ส่งสาร ➔',
    tab: 'experience'
  },
  {
    targetId: 'contact',
    badge: '📬 สถานีที่ 5 / 5 · หอส่งสาร',
    title: 'สิ้นสุดการทัวร์แล้ว ขอบคุณที่แวะมานะคะ! ✨',
    desc: 'หวังว่าจะชอบการทัวร์ชมผลงานนี้นะคะ! หากต้องการพูดคุยโปรเจกต์ สอบถาม หรือนัดสัมภาษณ์ สามารถส่งข้อความผ่านกล่องนี้ได้เลยค่ะ ข้อความจะส่งตรงถึงสายธารทันที',
    btnLabel: '🎉 จบการทัวร์',
    tab: null
  }
];

let currentTourStep = 0;
let isTourActive = false;

function startPortfolioTour() {
  GameAudio.playPop();
  isTourActive = true;
  currentTourStep = 0;
  const container = document.getElementById('tourGuideContainer');
  if (container) container.style.display = 'block';
  renderTourStep(currentTourStep);
}

function renderTourStep(index) {
  if (index < 0 || index >= tourSteps.length) return;
  const step = tourSteps[index];

  // Remove previous highlights
  document.querySelectorAll('.tour-target-highlight').forEach(el => el.classList.remove('tour-target-highlight'));

  // Switch tab if step requires it
  if (step.tab && typeof switchResumeTab === 'function') {
    switchResumeTab(step.tab);
  }

  // Scroll to target element
  const targetEl = document.getElementById(step.targetId);
  if (targetEl) {
    targetEl.classList.add('tour-target-highlight');
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Update Tour Card UI
  const badgeEl = document.getElementById('tourStationBadge');
  const titleEl = document.getElementById('tourStepTitle');
  const descEl = document.getElementById('tourStepDesc');
  const nextBtn = document.getElementById('tourNextBtn');
  const prevBtn = document.getElementById('tourPrevBtn');
  const dots = document.querySelectorAll('.tour-dot');

  if (badgeEl) badgeEl.textContent = step.badge;
  if (titleEl) titleEl.textContent = step.title;
  if (descEl) descEl.textContent = step.desc;
  if (nextBtn) nextBtn.textContent = step.btnLabel;
  if (prevBtn) {
    prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
  }

  // Update dots
  dots.forEach((dot, dIdx) => {
    dot.classList.toggle('active', dIdx === index);
  });
}

function nextTourStep() {
  GameAudio.playPop();
  if (currentTourStep < tourSteps.length - 1) {
    currentTourStep++;
    renderTourStep(currentTourStep);
  } else {
    endPortfolioTour();
  }
}

function prevTourStep() {
  GameAudio.playPop();
  if (currentTourStep > 0) {
    currentTourStep--;
    renderTourStep(currentTourStep);
  }
}

function endPortfolioTour() {
  GameAudio.playPop();
  isTourActive = false;
  document.querySelectorAll('.tour-target-highlight').forEach(el => el.classList.remove('tour-target-highlight'));
  const container = document.getElementById('tourGuideContainer');
  if (container) container.style.display = 'none';
}

// ==========================================
// CHIBI COMPANION (WALKING GAME AVATAR TOURS)
// ==========================================
const projectInsights = {
  'security-pitch': {
    title: 'Security Pitch Co., Ltd.',
    badge: '🛡️ PDPA & Cybersecurity SaaS (5+ ปี)',
    msg: 'ยินดีต้อนรับสู่ Security Pitch HQ! 🛡️ ที่นี่คือฐานปฏิบัติการหลัก 5 ปี 9 เดือนของสายธาร ดูแล UX/UI แพลตฟอร์ม Privacy & Security ครบวงจรค่ะ!',
    slug: 'security-pitch',
    isCareer: true
  },
  'pim-education': {
    title: 'สถาบันการจัดการปัญญาภิวัฒน์ (PIM)',
    badge: '🎓 ปริญญาตรีเกียรตินิยมอันดับ 1',
    msg: 'สถานี PIM Academy! 🎓 สายธารจบปริญญาตรีเกียรตินิยมอันดับ 1 ทุนการศึกษาเต็มจำนวน พร้อมฝึกงานจริงแบบ Work-based Learning ค่ะ!',
    slug: 'pim-education',
    isEducation: true
  },
  'csd-internship': {
    title: 'กองบังคับการปราบปราม (CSD)',
    badge: '👮‍♂️ สื่ออินโฟกราฟิกเตือนภัยสังคม',
    msg: 'สถานี กองปราบปราม! 👮‍♂️ จุดเริ่มต้นการฝึกงานออกแบบสื่อ Infographic & Motion เพื่อสื่อสารเตือนภัยสังคมให้เข้าใจง่ายค่ะ!',
    slug: 'csd-internship',
    isInternship: true
  },
  'flowpay-fintech-onboarding': {
    title: 'FlowPay FinTech',
    badge: '💳 FinTech / KYC Redesign',
    msg: 'สถานี FlowPay FinTech! 💳 โฟลว์นี้สายธารลดขั้นตอน KYC 12 สเต็ปให้เหลือ 4 สเต็ป คนผ่านง่ายขึ้น 38.4% เลยนะคะ!',
    slug: 'flowpay-fintech-onboarding'
  },
  'novacloud-enterprise-saas-design-system': {
    title: 'NovaCloud SaaS',
    badge: '💻 B2B SaaS / System',
    msg: 'สถานี NovaCloud Enterprise! ⚡ ระบบ Design System นี้มี Figma Tokens คลุม 14 โมดูล Dev ส่งงานไวขึ้น 2.4 เท่าค่ะ!',
    slug: 'novacloud-enterprise-saas-design-system'
  },
  'shopvibe-social-commerce-redesign': {
    title: 'ShopVibe Checkout',
    badge: '🛍️ Social Commerce / One-Page',
    msg: 'สถานี ShopVibe! 🛍️ หน้าชำระเงิน One-Page ลดเวลาสั่งซื้อเหลือ 45 วินาที ดันยอดขายและคอนเวอร์ชันโต 28% ค่ะ!',
    slug: 'shopvibe-social-commerce-redesign'
  },
  'medicare-accessible-health-companion': {
    title: 'MediCare Health',
    badge: '🩺 HealthTech / Accessibility',
    msg: 'สถานี MediCare Companion! 🩺 ออกแบบตามมาตรฐาน Accessibility WCAG AAA ผู้สูงอายุใช้งานสะดวก 94% พึงพอใจค่ะ!',
    slug: 'medicare-accessible-health-companion'
  }
};

const chibiQuotes = [
  "สวัสดีค่า! ฉันชื่อสายธาร เป็น UI/UX Designer & Developer ที่รักการออกแบบโปรดักต์ที่ใช้งานง่ายค่ะ ✨",
  "ทำงานที่ Security Pitch มา 5 ปี 9 เดือน ทั้งงาน Figma Design Tokens และเขียน Front-End Dev ควบคู่กันค่ะ 🛡️",
  "Figma คืออาวุธหลักของสายธาร! ตั้งแต่ Auto-Layout, Variables ไปจนถึง Interactive Prototyping 🎨",
  "คลิกที่การ์ดผลงานใบไหนก็ได้ เดี๋ยวสายธารจะวิ่งไปพาชมและเล่าวิธีคิดให้ฟังนะคะ! 🏃‍♀️💨",
  "ดีไซน์ที่ดี ไม่ใช่แค่สวย แต่ต้องช่วยแก้ปัญหาและสร้างคุณค่าให้ธุรกิจได้จริงค่ะ 💡"
];
let chibiQuoteIdx = 0;

function walkCharacterToProject(slug, targetElement) {
  const companion = document.getElementById('chibiCompanion');
  const bubble = document.getElementById('chibiBubble');
  const bubbleText = document.getElementById('chibiBubbleText');
  const bubbleActions = document.getElementById('chibiBubbleActions');
  const deepDiveBtn = document.getElementById('chibiDeepDiveBtn');
  const dust = document.getElementById('chibiDustPuff');

  if (!companion || !targetElement) return;

  GameAudio.playPop();

  // Highlight target card
  document.querySelectorAll('.project-card-highlighted').forEach(c => c.classList.remove('project-card-highlighted'));
  targetElement.classList.add('project-card-highlighted');

  // Trigger running animation
  companion.classList.add('is-running');
  if (dust) dust.style.opacity = '1';

  // Calculate card position
  const rect = targetElement.getBoundingClientRect();
  const cardCenterX = rect.left + window.scrollX;
  const cardCenterY = rect.top + window.scrollY;

  // Smooth scroll
  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Move companion to stand alongside the card
  companion.style.position = 'absolute';
  companion.style.left = Math.max(16, (cardCenterX - 85)) + 'px';
  companion.style.top = (cardCenterY + 45) + 'px';
  companion.style.bottom = 'auto';
  companion.style.right = 'auto';

  setTimeout(() => {
    companion.classList.remove('is-running');
    if (dust) dust.style.opacity = '0';
    GameAudio.playBoing();

    const insight = projectInsights[slug] || {
      msg: 'ผลงานชิ้นนี้สายธารให้ความสำคัญกับ User Experience และ Business Value ค่ะ!',
      slug: slug
    };

    if (bubbleText) bubbleText.textContent = insight.msg;
    if (bubbleActions) bubbleActions.style.display = 'block';
    if (deepDiveBtn) {
      deepDiveBtn.onclick = (e) => {
        e.stopPropagation();
        openCaseStudyModal(insight.slug);
      };
    }
    if (bubble) {
      bubble.style.display = 'block';
      bubble.classList.remove('pop');
      void bubble.offsetWidth;
      bubble.classList.add('pop');
    }
  }, 650);
}

function pokeChibi() {
  GameAudio.playBoing();
  const sprite = document.getElementById('chibiSpriteWrap');
  const bubble = document.getElementById('chibiBubble');
  const textEl = document.getElementById('chibiBubbleText');
  const actions = document.getElementById('chibiBubbleActions');

  if (sprite) {
    sprite.classList.remove('spinning');
    void sprite.offsetWidth;
    sprite.classList.add('spinning');
  }

  chibiQuoteIdx = (chibiQuoteIdx + 1) % chibiQuotes.length;
  if (textEl) textEl.textContent = chibiQuotes[chibiQuoteIdx];
  if (actions) actions.style.display = 'none';

  if (bubble) {
    bubble.style.display = 'block';
    bubble.classList.remove('pop');
    void bubble.offsetWidth;
    bubble.classList.add('pop');
  }
}

function summonChibiCompanion() {
  GameAudio.playPop();
  const companion = document.getElementById('chibiCompanion');
  if (!companion) return;

  // Reset companion to fixed bottom-left
  companion.style.position = 'fixed';
  companion.style.bottom = '24px';
  companion.style.left = '28px';
  companion.style.top = 'auto';
  companion.style.right = 'auto';

  pokeChibi();
}

function toggleMobileNav() {
  const menu = document.getElementById('mainNavMenu');
  if (menu) {
    menu.classList.toggle('open');
    GameAudio.playPop();
  }
}


// ==========================================
// ADVENTURE TOWN MAP CONTROLLERS
// ==========================================
function switchDeckView(mode) {
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();

  const mapWrap = document.getElementById('mapViewWrap');
  const deckWrap = document.getElementById('deckViewWrap');
  const btnMap = document.getElementById('btnSwitchMap');
  const btnDeck = document.getElementById('btnSwitchDeck');

  if (mode === 'map') {
    if (mapWrap) mapWrap.style.display = 'block';
    if (deckWrap) deckWrap.style.display = 'none';
    if (btnMap) btnMap.classList.add('active');
    if (btnDeck) btnDeck.classList.remove('active');
  } else {
    if (mapWrap) mapWrap.style.display = 'none';
    if (deckWrap) deckWrap.style.display = 'flex';
    if (btnDeck) btnDeck.classList.add('active');
    if (btnMap) btnMap.classList.remove('active');
  }
}

function selectMapLandmark(slug, x, y) {
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();

  // Move Avatar Pin on SVG map
  const avatarPin = document.getElementById('mapAvatarPin');
  if (avatarPin) {
    avatarPin.setAttribute('transform', 'translate(' + x + ', ' + y + ')');
  }

  const insight = projectInsights[slug] || {
    title: slug,
    msg: 'ยินดีต้อนรับสู่หมุดผลงานของสายธารค่ะ!',
    slug: slug
  };

  const companion = document.getElementById('chibiCompanion');
  const bubble = document.getElementById('chibiBubble');
  const bubbleText = document.getElementById('chibiBubbleText');
  const bubbleActions = document.getElementById('chibiBubbleActions');
  const deepDiveBtn = document.getElementById('chibiDeepDiveBtn');

  if (bubbleText) bubbleText.textContent = insight.msg;
  
  if (insight.isCareer) {
    if (bubbleActions) bubbleActions.style.display = 'block';
    if (deepDiveBtn) {
      deepDiveBtn.textContent = '🏢 ดูประวัติการทำงาน Security Pitch ➔';
      deepDiveBtn.onclick = (e) => {
        e.stopPropagation();
        switchResumeTab('experience');
        const jobCard = document.querySelector('.featured-current-job');
        if (jobCard) jobCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
    }
  } else if (insight.isEducation) {
    if (bubbleActions) bubbleActions.style.display = 'block';
    if (deepDiveBtn) {
      deepDiveBtn.textContent = '🎓 ดูประวัติการศึกษา PIM ➔';
      deepDiveBtn.onclick = (e) => {
        e.stopPropagation();
        switchResumeTab('education');
        const resumeSec = document.getElementById('resume');
        if (resumeSec) resumeSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
    }
  } else if (insight.isInternship) {
    if (bubbleActions) bubbleActions.style.display = 'block';
    if (deepDiveBtn) {
      deepDiveBtn.textContent = '👮‍♂️ ดูประวัติฝึกงาน ➔';
      deepDiveBtn.onclick = (e) => {
        e.stopPropagation();
        switchResumeTab('experience');
        const resumeSec = document.getElementById('resume');
        if (resumeSec) resumeSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
    }
  } else {
    // Case Study Project
    if (bubbleActions) bubbleActions.style.display = 'block';
    if (deepDiveBtn) {
      deepDiveBtn.textContent = '📖 อ่านเคสสตัดดี้ฉบับเต็ม ➔';
      deepDiveBtn.onclick = (e) => {
        e.stopPropagation();
        openCaseStudyModal(insight.slug);
      };
    }
  }

  if (bubble) {
    bubble.style.display = 'block';
    bubble.classList.remove('pop');
    void bubble.offsetWidth;
    bubble.classList.add('pop');
  }

  if (typeof GameAudio !== 'undefined') {
    setTimeout(() => GameAudio.playBoing(), 300);
  }
}

function walkMapToCoord(x, y) {
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();

  const avatarPin = document.getElementById('mapAvatarPin');
  if (avatarPin) {
    avatarPin.setAttribute('transform', 'translate(' + x + ', ' + y + ')');
  }

  const bubble = document.getElementById('chibiBubble');
  const bubbleText = document.getElementById('chibiBubbleText');
  const bubbleActions = document.getElementById('chibiBubbleActions');

  if (bubbleText) bubbleText.textContent = 'เดินมาถึงจุดแวะพักตรวจเช็ก UX Flow แล้วค่ะ! 🌟 คลิกที่ตึกรอบข้างเพื่อเดินทางต่อนะคะ';
  if (bubbleActions) bubbleActions.style.display = 'none';

  if (bubble) {
    bubble.style.display = 'block';
    bubble.classList.remove('pop');
    void bubble.offsetWidth;
    bubble.classList.add('pop');
  }
}

function resetMapCharacter() {
  selectMapLandmark('security-pitch', 480, 150);
}

// ==========================================================
// CHIBI COMPANION SHOW / HIDE TOGGLE SYSTEM
// ==========================================================
function toggleChibiCompanion(show) {
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();
  const companion = document.getElementById('chibiCompanion');
  const pill = document.getElementById('chibiMinimizedPill');

  if (typeof show === 'undefined') {
    // If not specified, toggle current state
    show = companion && companion.style.display === 'none';
  }

  if (show) {
    if (companion) {
      companion.style.display = 'flex';
      companion.style.opacity = '1';
    }
    if (pill) pill.style.display = 'none';
    pokeChibi();
  } else {
    if (companion) {
      companion.style.display = 'none';
    }
    if (pill) pill.style.display = 'inline-flex';
  }
}

function closeChibiBubble(e) {
  if (e) e.stopPropagation();
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();
  const bubble = document.getElementById('chibiBubble');
  if (bubble) bubble.style.display = 'none';
}

// Override summonChibiCompanion to toggle
function summonChibiCompanion() {
  const companion = document.getElementById('chibiCompanion');
  if (!companion || companion.style.display === 'none') {
    toggleChibiCompanion(true);
  } else {
    pokeChibi();
  }
}

// ==========================================================
// ADVENTURE MINIMAP REOPEN FIX
// ==========================================================
function handleMinimapContainerClick(e) {
  const minimap = document.getElementById('adventureMinimap');
  // If clicked while collapsed, expand it!
  if (minimap && minimap.classList.contains('collapsed')) {
    toggleMinimap(e);
  }
}

// Enhanced toggleMinimap with sound & clean icon state
function toggleMinimap(e) {
  if (e) e.stopPropagation();
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();
  const minimap = document.getElementById('adventureMinimap');
  const icon = document.getElementById('minimapToggleIcon');
  if (!minimap) return;

  const isNowCollapsed = minimap.classList.toggle('collapsed');
  if (icon) {
    icon.textContent = isNowCollapsed ? '🗺️' : '−';
  }
  minimap.setAttribute('title', isNowCollapsed ? 'คลิกเพื่อเปิดแผนที่ทัวร์ 🗺️' : 'ย่อแผนที่');
}

// ==========================================================
// 3-WAY VIEW SWITCHER (LOCALROUTE SIMULATOR / MAP / DECK)
// ==========================================================
function switchDeckView(mode) {
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();

  const simWrap = document.getElementById('localrouteViewWrap');
  const mapWrap = document.getElementById('mapViewWrap');
  const deckWrap = document.getElementById('deckViewWrap');

  const btnSim = document.getElementById('btnSwitchLocalRoute');
  const btnMap = document.getElementById('btnSwitchMap');
  const btnDeck = document.getElementById('btnSwitchDeck');

  if (mode === 'localroute') {
    if (simWrap) simWrap.style.display = 'block';
    if (mapWrap) mapWrap.style.display = 'none';
    if (deckWrap) deckWrap.style.display = 'none';

    if (btnSim) btnSim.classList.add('active');
    if (btnMap) btnMap.classList.remove('active');
    if (btnDeck) btnDeck.classList.remove('active');
  } else if (mode === 'map') {
    if (simWrap) simWrap.style.display = 'none';
    if (mapWrap) mapWrap.style.display = 'block';
    if (deckWrap) deckWrap.style.display = 'none';

    if (btnMap) btnMap.classList.add('active');
    if (btnSim) btnSim.classList.remove('active');
    if (btnDeck) btnDeck.classList.remove('active');
  } else {
    if (simWrap) simWrap.style.display = 'none';
    if (mapWrap) mapWrap.style.display = 'none';
    if (deckWrap) deckWrap.style.display = 'flex';

    if (btnDeck) btnDeck.classList.add('active');
    if (btnSim) btnSim.classList.remove('active');
    if (btnMap) btnMap.classList.remove('active');
  }
}

function setSimDeviceMode(mode) {
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();
  const frame = document.getElementById('phoneDeviceFrame');
  const btnMobile = document.getElementById('btnSimMobile');
  const btnWide = document.getElementById('btnSimWide');

  if (mode === 'wide') {
    if (frame) frame.classList.add('wide-mode');
    if (btnWide) btnWide.classList.add('active');
    if (btnMobile) btnMobile.classList.remove('active');
  } else {
    if (frame) frame.classList.remove('wide-mode');
    if (btnMobile) btnMobile.classList.add('active');
    if (btnWide) btnWide.classList.remove('active');
  }
}

// Global active HUD state
let currentHudSlug = 'security-pitch';

function handleHudActionClick() {
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();
  const insight = projectInsights[currentHudSlug];
  if (!insight) return;

  if (insight.slug === 'localroute-transit-travel-hub') {
    switchDeckView('localroute');
    const sim = document.getElementById('localrouteViewWrap');
    if (sim) sim.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (insight.isCareer) {
    switchResumeTab('experience');
    const jobCard = document.querySelector('.featured-current-job');
    if (jobCard) jobCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (insight.isEducation) {
    switchResumeTab('education');
    const resumeSec = document.getElementById('resume');
    if (resumeSec) resumeSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (insight.isInternship) {
    switchResumeTab('experience');
    const resumeSec = document.getElementById('resume');
    if (resumeSec) resumeSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    openCaseStudyModal(insight.slug);
  }
}

// Expand projectInsights with LocalRoute
if (typeof projectInsights !== 'undefined') {
  projectInsights['localroute-transit-travel-hub'] = {
    title: 'LocalRoute Transit & Travel Hub',
    badge: '🗺️ แอปแผนที่ขนส่งไทย / Live Vercel',
    msg: 'ยินดีต้อนรับสู่สถานี LocalRoute! 🚊 แอปนำทางรถสองแถวแดง & ขนส่งสาธารณะไทย พร้อมแผนที่ Leaflet และตัวช่วยนักท่องเที่ยว ลองเล่นแอปจริงได้เลยนะคะ!',
    slug: 'localroute-transit-travel-hub',
    icon: '🚊',
    actionText: '🎮 สลับไปเล่นแอปตัวเต็ม ➔'
  };
}

// Enhanced selectMapLandmark to update Map Avatar + Station HUD
const originalSelectMapLandmark = selectMapLandmark;
selectMapLandmark = function(slug, x, y) {
  currentHudSlug = slug;
  if (typeof GameAudio !== 'undefined') GameAudio.playPop();

  // 1. Move Avatar Pin on SVG map
  const avatarPin = document.getElementById('mapAvatarPin');
  if (avatarPin) {
    avatarPin.setAttribute('transform', 'translate(' + x + ', ' + y + ')');
  }

  const insight = projectInsights[slug] || {
    title: slug,
    msg: 'ยินดีต้อนรับสู่สถานีผลงานของสายธารค่ะ!',
    slug: slug,
    icon: '📍'
  };

  // 2. Update Map Station HUD
  const hudIcon = document.getElementById('hudStationIcon');
  const hudTitle = document.getElementById('hudStationTitle');
  const hudDesc = document.getElementById('hudStationDesc');
  const hudBtn = document.getElementById('hudActionBtn');

  if (hudIcon) hudIcon.textContent = insight.icon || (insight.badge ? insight.badge.split(' ')[0] : '📍');
  if (hudTitle) hudTitle.textContent = insight.title;
  if (hudDesc) hudDesc.textContent = insight.msg;

  if (hudBtn) {
    if (insight.slug === 'localroute-transit-travel-hub') {
      hudBtn.textContent = '🎮 สลับไปเล่นแอปตัวเต็ม ➔';
    } else if (insight.isCareer) {
      hudBtn.textContent = '🏢 ดูประวัติ Security Pitch ➔';
    } else if (insight.isEducation) {
      hudBtn.textContent = '🎓 ดูประวัติการศึกษา PIM ➔';
    } else if (insight.isInternship) {
      hudBtn.textContent = '👮‍♂️ ดูประวัติฝึกงาน ➔';
    } else {
      hudBtn.textContent = '📖 เปิดเคสสตัดดี้ฉบับเต็ม ➔';
    }
  }

  // 3. Update Chibi Companion Bubble
  const bubble = document.getElementById('chibiBubble');
  const bubbleText = document.getElementById('chibiBubbleText');
  const bubbleActions = document.getElementById('chibiBubbleActions');
  const deepDiveBtn = document.getElementById('chibiDeepDiveBtn');

  if (bubbleText) bubbleText.textContent = insight.msg;
  if (bubbleActions) bubbleActions.style.display = 'block';
  if (deepDiveBtn) {
    deepDiveBtn.onclick = (e) => {
      e.stopPropagation();
      handleHudActionClick();
    };
  }

  if (bubble) {
    bubble.style.display = 'block';
    bubble.classList.remove('pop');
    void bubble.offsetWidth;
    bubble.classList.add('pop');
  }

  if (typeof GameAudio !== 'undefined') {
    setTimeout(() => GameAudio.playBoing(), 300);
  }
};
