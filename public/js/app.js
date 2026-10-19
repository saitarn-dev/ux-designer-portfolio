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
    console.error('Error fetching case studies:', err);
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--accent-coral);">
        ไม่สามารถโหลดผลงานได้ในขณะนี้ กรุณาตรวจสอบสถานะเซิร์ฟเวอร์และ MongoDB
      </div>
    `;
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
          <div style="display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap;">
            ${(study.roleTags && study.roleTags.length > 0 ? study.roleTags : ['UX Research', 'UI Design']).map(tag => `
              <span style="font-size: 0.74rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12); color: #cbd5e1;">
                ${tag.toLowerCase().includes('research') ? '🔍 ' : '🎨 '}${tag}
              </span>
            `).join('')}
          </div>
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
  document.getElementById('resumeModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Recruiter Messages / Admin Modal Trigger
async function openMessagesModal() {
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
