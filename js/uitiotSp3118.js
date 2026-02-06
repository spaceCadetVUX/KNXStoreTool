document.addEventListener('DOMContentLoaded', function() {
    // --- 1. JS for color switching ---
    const heroImg = document.querySelector('.hero-img');
    const heroColor = document.querySelector('.hero-color');
    const heroProtocol = document.querySelector('.hero-protocol');
    const thumbs = document.querySelectorAll('.thumb'); 
    let globalIconWeight = document.querySelector('input[name="icon-weight"]:checked')?.value || '400';
    function setActiveThumb(selectedThumb) {
        if (!selectedThumb) return;
        thumbs.forEach(thumb => {
            thumb.style.borderColor = 'transparent'; 
        });
        selectedThumb.style.borderColor = '#0d6efd'; 
    }
    const initialActiveThumb = document.querySelector('.thumb[data-color="snowflake-silver"]');
    if (initialActiveThumb) setActiveThumb(initialActiveThumb);
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function(e) {
            e.preventDefault();
            const thumbImg = thumb.querySelector('img');
            if (!thumbImg) return;
            const newImgSrc = thumbImg.src;
            const newAltText = thumbImg.alt || "Supercar";
            const newName = newAltText.replace(' thumbnail', '');
            if (heroImg) heroImg.src = newImgSrc;
            if (heroColor) heroColor.textContent = `color: ${newName}`;
            setActiveThumb(thumb);
        });
    });
    // --- Protocol selection ---
    const protocolRadios = document.querySelectorAll('input[name="protocol"]');
    protocolRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (heroProtocol) heroProtocol.textContent = `note: ${this.value}`;
        });
    });
    // ═══════════════════════════════════════════════════════════
// NEW: Support for two customer inputs → Note + Room/Location
// ═══════════════════════════════════════════════════════════
const noteInput = document.querySelector('input[name="protocol"]');   // First input (existing)
const roomInput = document.querySelector('input[name="room"]');       // Second input (new)
function updateHeroNoteDisplay() {
    if (!heroProtocol) return;
    const note = (noteInput?.value || '').trim();
    const room = (roomInput?.value || '').trim();
    let displayText = '';
    if (note && room) {
        displayText = `Note: ${note} • ${room}`;
    } else if (note) {
        displayText = `Note: ${note}`;
    } else if (room) {
        displayText = `Room: ${room}`;
    } else {
        displayText = 'Note: —';
    }
    heroProtocol.textContent = displayText;
}
// Live update when typing in either field
if (noteInput) {
    noteInput.addEventListener('input', updateHeroNoteDisplay);
}
if (roomInput) {
    roomInput.addEventListener('input', updateHeroNoteDisplay);
}
// Also refresh display when switching tabs (ensures correct text after render)
document.querySelectorAll('.option-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        setTimeout(updateHeroNoteDisplay, 50); // small delay to run after overlay render
    });
});
// Initial update on page load
updateHeroNoteDisplay();
    // --- Tabs ---
    const tabs = document.querySelectorAll('.option-tab');
    const panes = document.querySelectorAll('.tab-pane');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabKey = tab.getAttribute('data-tab');
            panes.forEach(pane => {
                if (pane.getAttribute('data-tab') === tabKey) {
                    pane.classList.remove('hidden', 'd-none'); 
                    pane.classList.add('d-block');
                } else {
                    pane.classList.add('hidden', 'd-none');
                    pane.classList.remove('d-block');
                }
            });
            if (tabKey === 'single') {
                showSingleTextMode(true);
                showDoubleTextMode(false);
                renderSingleTextOverlay();
            } else if (tabKey === 'double') {
                showDoubleTextMode(true);
                showSingleTextMode(false);
                renderDoubleTextOverlay();
            } else {
                showSingleTextMode(false);
                showDoubleTextMode(false);
                renderHeroIcons();
            }
        });
    });
    // --- Modal & Icon Picker Setup ---
    const iconGrid = document.getElementById('icon-grid');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal');
    const modalIconGrid = document.getElementById('modal-icon-grid');
    const modalIconSearch = document.getElementById('modal-icon-search');
    const asideWeightSelector = document.querySelector('.font-options .d-flex');
    const modalWeightSelector = document.getElementById('modal-weight-selector');
    if (asideWeightSelector && modalWeightSelector) {
        const clone = asideWeightSelector.cloneNode(true);
        modalWeightSelector.innerHTML = ''; 
        Array.from(clone.children).forEach(child => {
            const input = child; 
            if(input.tagName === 'INPUT') {
                const oldId = input.id;
                const newId = `modal-${oldId}`;
                input.id = newId;
                input.name = 'modal-icon-weight';
                const label = clone.querySelector(`label[for="${oldId}"]`);
                if(label) label.htmlFor = newId;
                modalWeightSelector.appendChild(input);
                if(label) modalWeightSelector.appendChild(label);
            }
        });
    }
    let currentButton = null;
    const heroIconsContainer = document.getElementById('hero-icons');
    // --- ICON_LIST ---
const ICON_LIST = [
  'Volume_off',
  'ac_unit',
  'add',
  'admin_panel_settings',
  'air',
  'album',
  'apps',
  'arrow_back',
  'arrow_forward',
  'backlight_high',
  'balcony',
  'bathtub',
  'bed',
  'bedtime',
  'bolt',
  'calendar_month',
  'camera_indoor',
  'camera_outdoor',
  'cast',
  'chair',
  'chair_umbrella',
  'check',
  'check_box',
  'child_friendly',
  'clear_day',
  'close',
  'closed_caption',
  'cloud',
  'cloudy',
  'coffee',
  'countertops',
  'dark_mode',
  'deck',
  'delete',
  'desktop_windows',
  'developer_board',
  'devices_other',
  'dining',
  'directions_car',
  'door_back',
  'door_front',
  'door_sliding',
  'download',
  'dry_cleaning',
  'eco',
  'edit',
  'egg',
  'enhanced_encryption',
  'error',
  'face',
  'fence',
  'filter_list',
  'fingerprint',
  'fire_extinguisher',
  'fireplace',
  'forest',
  'fork_spoon',
  'foundation',
  'gamepad',
  'garage',
  'gpp_good',
  'grass',
  'grid_view',
  'headphones',
  'help',
  'highlight',
  'home',
  'home_iot_device',
  'hot_tub',
  'house',
  'hub',
  'humidity_high',
  'humidity_low',
  'humidity_mid',
  'info',
  'key',
  'keyboard',
  'king_bed',
  'kitchen',
  'landscape',
  'laptop',
  'library_music',
  'light',
  'light_mode',
  'light_off',
  'lightbulb',
  'lightbulb_2',
  'link',
  'living',
  'local_bar',
  'local_fire_department',
  'local_gas_station',
  'local_hospital',
  'local_laundry_service',
  'local_police',
  'lock',
  'lock_open',
  'massage',
  'matter',
  'memory',
  'menu',
  'menu_book',
  'mic',
  'mic_double',
  'mic_off',
  'mode_cool_off',
  'more_horiz',
  'more_vert',
  'mouse',
  'movie',
  'music_note',
  'nightlight',
  'no_encryption',
  'not_started',
  'notifications',
  'outlet',
  'palette',
  'pan_tool',
  'park',
  'password',
  'pause',
  'person',
  'pets',
  'photo_camera',
  'pill',
  'planet',
  'play_arrow',
  'play_circle',
  'podcasts',
  'pool',
  'power',
  'power_settings_new',
  'privacy_tip',
  'public',
  'radio',
  'radio_button_checked',
  'rainy',
  'refresh',
  'relax',
  'remove',
  'restaurant',
  'roller_shades',
  'roofing',
  'router',
  'routine',
  'sauna',
  'save',
  'scanner',
  'schedule',
  'security',
  'self_care',
  'sensor_door',
  'sensor_window',
  'sensors',
  'settings',
  'severe_cold',
  'shield',
  'shopping_cart',
  'shower',
  'single_bed',
  'skip_next',
  'skip_previous',
  'sliders',
  'smartphone',
  'smoking_rooms',
  'snowmobile',
  'soap',
  'solar_power',
  'roller_shades_closed',
  'spa',
  'speaker',
  'speaker_group',
  'speed',
  'sports_bar',
  'sprinkler',
  'stairs',
  'star',
  'store',
  'sunny',
  'sunny_snowing',
  'surround_sound',
  'table_lamp',
  'tablet',
  'thermometer',
  'thermometer_gain',
  'thermometer_loss',
  'thermostat',
  'thermostat_auto',
  'thunderstorm',
  'toggle_off',
  'toggle_on',
  'tune',
  'tv',
  'tv_gen',
  'upload',
  'verified_user',
  'vertical_shades',
  'vertical_shades_closed',
  'videocam',
  'videocam_off',
  'view_list',
  'visibility',
  'visibility_off',
  'volume_down',
  'volume_mute',
  'volume_up',
  'wall_lamp',
  'warning',
  'watch',
  'water',
  'water_drop',
  'wb_sunny',
  'wb_twilight',
  'wifi',
  'wind_power',
  'window',
  'zoom_in',
  'zoom_out',
];
    // --- Render Functions ---
    function renderHeroIcons(limit = 8) {
        if (!heroIconsContainer) return;
        const asideIconButtons = Array.from(document.querySelectorAll('#icon-grid .icon-btn'));
        heroIconsContainer.innerHTML = '';
        const yPositions = ['5%', '30%', '60%', '85%'];
        const positions = yPositions.flatMap(top => [
            { left: '6%', top },
            { right: '6%', top },
        ]);
        asideIconButtons.slice(0, limit).forEach((btn, idx) => {
            const heroBtn = document.createElement('button');
            heroBtn.type = 'button';
            heroBtn.className = 'hero-icon position-absolute d-inline-flex align-items-center justify-content-center rounded text-white';
            heroBtn.style.width = '2.5rem'; 
            heroBtn.style.height = '2.5rem';
            heroBtn.style.fontSize = '1.5rem';
            heroBtn.style.pointerEvents = 'auto';
            heroBtn.style.background = 'transparent';
            heroBtn.style.border = 'none';
            heroBtn.style.transition = 'transform 0.2s';
            heroBtn.onmouseover = () => heroBtn.style.transform = 'scale(1.1)';
            heroBtn.onmouseout = () => heroBtn.style.transform = 'scale(1)';
            heroBtn.dataset.index = String(idx);
            let iconName = 'home';
            const iconWeight = globalIconWeight || '400';
            const iconElement = btn.querySelector('.material-symbols-outlined');
            if (iconElement) {
                iconName = iconElement.textContent.trim() || 'home';
            }
            heroBtn.innerHTML = `<span class="material-symbols-outlined" style="font-variation-settings: 'wght' ${iconWeight}; font-weight: ${iconWeight}; font-family: 'Material Symbols Outlined'; text-transform:none">${iconName}</span>`;
            const pos = positions[idx] || positions[0];
            Object.keys(pos).forEach(k => { heroBtn.style[k] = pos[k]; });
            heroBtn.addEventListener('click', () => {
                document.querySelectorAll('.hero-icon.selected').forEach(el => {
                    el.classList.remove('selected');
                    el.style.border = 'none';
                });
                heroBtn.classList.add('selected');
                heroBtn.style.border = '2px solid #0d6efd'; 
                const correspondingAside = document.querySelectorAll('#icon-grid .icon-btn')[idx];
                if (correspondingAside) correspondingAside.focus();
            });
            heroIconsContainer.appendChild(heroBtn);
        });
    }
    const fontSizeMap = {
        'text-xs': '0.75rem',
        'text-sm': '0.875rem',
        'text-base': '1rem',
        'text-lg': '1.125rem',
        'text-xl': '1.25rem'
    };
    // --- Single Line Overlay ---
    const singleInputs = Array.from({ length: 8 }, (_, i) => document.getElementById(`single-input-${i+1}`));
    function renderSingleTextOverlay() {
        if (!heroIconsContainer) return;
        let weight = '400';
        const checked = document.querySelector('input[name="single-text-weight"]:checked');
        if (checked) weight = checked.value;
        let sizeClass = 'text-sm';
        const checkedSize = document.querySelector('input[name="single-text-size"]:checked');
        if (checkedSize) sizeClass = checkedSize.value;
        const yPositions = ['5%', '30%', '60%', '85%'];
        const positions = yPositions.flatMap(top => [
            { left: '6%', top },
            { right: '6%', top },
        ]);
        heroIconsContainer.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const val = (singleInputs[i] && singleInputs[i].value) ? singleInputs[i].value : '';
            const isLeft = i % 2 === 0;
            const alignClass = isLeft ? 'justify-content-start text-start' : 'justify-content-end text-end';
            const el = document.createElement('div');
            el.className = `hero-text position-absolute d-inline-flex align-items-center ${alignClass} px-2 py-1 rounded text-white`;
            el.dataset.index = String(i);
            el.style.fontWeight = weight;
            el.style.fontVariationSettings = `'wght' ${weight}`;
            el.style.fontSize = fontSizeMap[sizeClass] || '0.875rem';
            const pos = positions[i] || positions[0];
            Object.keys(pos).forEach(k => { el.style[k] = pos[k]; });
            el.textContent = val;
            heroIconsContainer.appendChild(el);
        }
    }
    function showSingleTextMode(enable) {
        if (iconGrid) {
            if(enable) iconGrid.classList.add('d-none');
            else iconGrid.classList.remove('d-none');
        }
        if (enable) renderSingleTextOverlay();
        else renderHeroIcons();
    }
    singleInputs.forEach(inp => {
        if (!inp) return;
        inp.addEventListener('input', () => {
             renderSingleTextOverlay();
        });
    });
    document.querySelectorAll('input[name="single-text-weight"]').forEach(radio => {
        radio.addEventListener('change', () => {
             renderSingleTextOverlay();
        });
    });
    document.querySelectorAll('input[name="single-text-size"]').forEach(radio => {
        radio.addEventListener('change', () => {
             renderSingleTextOverlay();
        });
    });
    // --- Double Line Overlay ---
    const doubleInputs = Array.from({ length: 16 }, (_, i) => document.getElementById(`double-input-${i+1}`));
    function renderDoubleTextOverlay() {
        if (!heroIconsContainer) return;
        let weight = '400';
        const checked = document.querySelector('input[name="double-text-weight"]:checked');
        if (checked) weight = checked.value;
        let sizeClass = 'text-sm';
        const checkedSize = document.querySelector('input[name="double-text-size"]:checked');
        if (checkedSize) sizeClass = checkedSize.value;
        const yPositions = ['5%', '10%', '30%', '35%', '57%', '62%', '82%', '87%'];
        const positions = yPositions.flatMap(top => [
            { left: '6%', top },
            { right: '6%', top },
        ]);
        heroIconsContainer.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const val = (doubleInputs[i] && doubleInputs[i].value) ? doubleInputs[i].value : '';
            const isLeft = i % 2 === 0;
            const alignClass = isLeft ? 'justify-content-start text-start' : 'justify-content-end text-end';
            const el = document.createElement('div');
            el.className = `hero-text position-absolute d-inline-flex align-items-center ${alignClass} px-2 py-1 rounded text-white`;
            el.dataset.index = String(i);
            el.style.fontWeight = weight;
            el.style.fontVariationSettings = `'wght' ${weight}`;
            el.style.fontSize = fontSizeMap[sizeClass] || '0.875rem';
            const pos = positions[i] || positions[0];
            Object.keys(pos).forEach(k => { el.style[k] = pos[k]; });
            el.textContent = val;
            heroIconsContainer.appendChild(el);
        }
    }
    function showDoubleTextMode(enable) {
        if (iconGrid) {
            if(enable) iconGrid.classList.add('d-none');
            else iconGrid.classList.remove('d-none');
        }
        if (enable) renderDoubleTextOverlay();
        else renderHeroIcons();
    }
    doubleInputs.forEach(inp => {
        if (!inp) return;
        inp.addEventListener('input', () => {
            renderDoubleTextOverlay();
        });
    });
    document.querySelectorAll('input[name="double-text-weight"]').forEach(radio => {
        radio.addEventListener('change', () => {
            renderDoubleTextOverlay();
        });
    });
    document.querySelectorAll('input[name="double-text-size"]').forEach(radio => {
        radio.addEventListener('change', () => {
            renderDoubleTextOverlay();
        });
    });
    // --- Modal Logic ---
    function populateModalGrid(filter = "") {
        if (!modalIconGrid) return;
        modalIconGrid.innerHTML = '';
        const modalCheckedInput = document.querySelector('input[name="modal-icon-weight"]:checked');
        let selectedWeight = globalIconWeight || '400';
        if (modalCheckedInput) selectedWeight = modalCheckedInput.value;
        const icons = filter
            ? ICON_LIST.filter(name => name.toLowerCase().includes(filter.toLowerCase()))
            : ICON_LIST;
        icons.forEach(iconName => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'modal-icon btn btn-light p-3 d-flex align-items-center justify-content-center border-0';
            button.style.fontSize = '2rem'; 
            button.style.transition = 'all 0.2s';
            button.onmouseover = () => { 
                button.classList.remove('btn-light'); 
                button.classList.add('btn-primary'); 
                button.style.transform = 'scale(1.1)';
            };
            button.onmouseout = () => { 
                button.classList.add('btn-light'); 
                button.classList.remove('btn-primary'); 
                button.style.transform = 'scale(1)';
            };
            const span = document.createElement('span');
            span.className = 'material-symbols-outlined';
            span.style.fontVariationSettings = `'wght' ${selectedWeight}`;
            span.style.fontWeight = selectedWeight;
            span.style.fontFamily = 'Material Symbols Outlined';
            span.textContent = iconName;
            span.style.textTransform = 'none';
            button.appendChild(span);
            button.dataset.iconName = iconName;
            button.dataset.iconWeight = selectedWeight;
            const col = document.createElement('div');
            col.className = 'col';
            col.appendChild(button);
            button.style.width = '100%';
            modalIconGrid.appendChild(col);
        });
        if (modalIconGrid.children.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'col-12 text-center text-secondary py-4';
            placeholder.textContent = filter ? `No icons match "${filter}"` : 'No icons available';
            modalIconGrid.appendChild(placeholder);
        }
    }
    populateModalGrid();
    if (modalIconSearch) {
        modalIconSearch.addEventListener('input', function(e) {
            populateModalGrid(e.target.value);
        });
    }
    const openModal = (button) => {
        currentButton = button;
        const asideWeight = globalIconWeight || '400';
        const modalInputToSync = document.querySelector(`input[name="modal-icon-weight"][value="${asideWeight}"]`);
        if (modalInputToSync) {
            document.querySelectorAll('input[name="modal-icon-weight"]').forEach(inp => inp.checked = false);
            modalInputToSync.checked = true;
        }
        populateModalGrid(modalIconSearch?.value || '');
        if (modal) {
            modal.classList.remove('hidden', 'd-none');
            modal.classList.add('d-flex');
        }
        if (modalContent) {
            modalContent.style.opacity = '0';
            setTimeout(() => {
                modalContent.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);
        }
    };
    const closeModal = () => {
        if (modalContent) {
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'scale(0.95)';
        }
        if (modal) {
            setTimeout(() => {
                modal.classList.remove('d-flex');
                modal.classList.add('hidden', 'd-none');
                currentButton = null;
            }, 200);
        }
    };
    function adjustIconWeights(newWeight) {
        globalIconWeight = newWeight;
        const icons = document.querySelectorAll('#icon-grid .icon-btn .material-symbols-outlined');
        icons.forEach(span => {
            if (span) {
                span.style.fontVariationSettings = `'wght' ${newWeight}`;
                span.style.fontWeight = newWeight;
                span.style.fontFamily = 'Material Symbols Outlined';
            }
        });
        renderHeroIcons();
    }
    if (iconGrid) {
        iconGrid.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.icon-btn');
            if (clickedButton) openModal(clickedButton);
        });
    }
    if (modalIconGrid) {
        modalIconGrid.addEventListener('click', (e) => {
            const clickedModalIcon = e.target.closest('.modal-icon');
            if (clickedModalIcon && currentButton) {
                const iconName = clickedModalIcon.dataset.iconName;
                let weight = globalIconWeight || '400';
                if(clickedModalIcon.dataset.iconWeight) weight = clickedModalIcon.dataset.iconWeight;
                else {
                     const chk = document.querySelector('input[name="modal-icon-weight"]:checked');
                     if(chk) weight = chk.value;
                }
                const targetIconSpan = currentButton.querySelector('.material-symbols-outlined');
                if (targetIconSpan) {
                    targetIconSpan.textContent = iconName;
                    targetIconSpan.style.fontVariationSettings = `'wght' ${weight}`;
                    targetIconSpan.style.fontWeight = weight;
                }
                try { renderHeroIcons(); } catch (e) {}
                const modalCheckedInput = document.querySelector('input[name="modal-icon-weight"]:checked');
                if (modalCheckedInput) {
                    const modalWeight = modalCheckedInput.value;
                    const asideInputToSync = document.querySelector(`input[name="icon-weight"][value="${modalWeight}"]`);
                    if (asideInputToSync) {
                        asideInputToSync.checked = true;
                        asideInputToSync.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
                closeModal();
            }
        });
    }
    if (modalWeightSelector) {
        modalWeightSelector.addEventListener('change', (e) => {
            if(e.target.name === 'modal-icon-weight') {
                populateModalGrid(modalIconSearch?.value || '');
            }
        });
    }
    if (asideWeightSelector) {
        asideWeightSelector.addEventListener('change', (e) => {
            if(e.target.name === 'icon-weight') {
                const newWeight = e.target.value;
                adjustIconWeights(newWeight);
                const modalInputToSync = modalWeightSelector.querySelector(`input[value="${newWeight}"]`);
                if (modalInputToSync) {
                    const allModalInputs = modalWeightSelector.querySelectorAll('input');
                    allModalInputs.forEach(inp => inp.checked = false);
                    modalInputToSync.checked = true;
                }
                populateModalGrid(modalIconSearch?.value || '');
            }
        });
    }
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && !modal.classList.contains('hidden')) closeModal();
        }
    });
// --- Export Functionality ---
// --- Export Functionality (Targeting the Parent Wrapper) ---
    const exportBtn = document.getElementById('export-btn');
    const exportSingleBtn = document.getElementById('export-single-btn');
    const exportDualBtn = document.getElementById('export-dual-btn');
    // CHANGE: Select the new parent ID
    const exportWrapper = document.getElementById('export-wrapper');
    // Store SVG for PDF export
    let currentSVGString = null; 
    async function exportCurrentTabImage() {
        if (!exportWrapper || !html2canvas) return;
        // 1. Update live view first
        const activeTab = document.querySelector('.option-tab.active');
        const tabKey = activeTab?.getAttribute('data-tab');
        if (tabKey === 'single') renderSingleTextOverlay();
        else if (tabKey === 'double') renderDoubleTextOverlay();
        else renderHeroIcons();
        // Wait for fonts
        await new Promise(r => setTimeout(r, 100));
        // 2. Clone the Parent Wrapper
        const clone = exportWrapper.cloneNode(true);
        // 3. Style the Clone for a perfect snapshot
        // We strip the centering classes and force it to be a fixed 400px block at the top-left.
        Object.assign(clone.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '400px',       // Force desktop width
            height: 'auto',
            margin: '0',
            padding: '0',         // Remove wrapper padding
            backgroundColor: '#ffffff',
            zIndex: '9999',       // Sit on top
            display: 'block',     // Remove d-flex behavior for the snapshot
            borderRadius: '0'
        });
        // Clean up inner spacing in the clone
        const innerContainer = clone.querySelector('#export-container');
        if(innerContainer) {
            innerContainer.style.margin = '0';
            innerContainer.style.width = '100%';
        }
        // Ensure the image inside is fully visible
        const cloneImg = clone.querySelector('.hero-img');
        if(cloneImg) {
            Object.assign(cloneImg.style, {
                width: '100%',
                height: 'auto',
                maxWidth: 'none',
                display: 'block'
            });
        }
        // Remove Bootstrap spacing classes from the clone
        clone.classList.remove('d-flex', 'justify-content-center', 'mb-4');
        // 4. Append Clone
        document.body.appendChild(clone);
        try {
            // 5. Capture
            const canvas = await html2canvas(clone, {
                scale: 2, 
                useCORS: true,
                backgroundColor: '#ffffff',
                width: 400, 
                windowWidth: 1200, 
                x: 0, 
                y: 0,
                scrollX: 0,
                scrollY: 0
            });
            // 6. Download
            const colorText = heroColor.textContent.replace('Color: ', '').toLowerCase().replace(/\s+/g, '-');
            const protocolText = heroProtocol.textContent.replace('Protocol: ', '').toLowerCase();
            let suffix = tabKey === 'single' ? 'single' : tabKey === 'double' ? 'double' : 'icons';
            const link = document.createElement('a');
            link.download = `moorgen-${colorText}-${protocolText}-${suffix}.png`;
            const dataUrl = canvas.toDataURL('image/png');
            link.href = dataUrl;
            link.click();
            // Send image to formPDF if window is open
            if (window.opener && window.opener.setExportedImage) {
                window.opener.setExportedImage(dataUrl);
            }
        } catch (err) {
            console.error('Export failed:', err);
            alert('Failed to export image.');
        } finally {
            // 7. Remove Clone
            document.body.removeChild(clone);
        }
    }
    if (exportBtn) exportBtn.addEventListener('click', exportCurrentTabImage);
    if (exportSingleBtn) exportSingleBtn.addEventListener('click', exportCurrentTabImage);
    if (exportDualBtn) exportDualBtn.addEventListener('click', exportCurrentTabImage);
    // --- FIX: INITIAL RENDER ---
    // Check which tab is active on load and render accordingly
    const defaultActiveTab = document.querySelector('.option-tab.active');
    if (defaultActiveTab) {
        const tabKey = defaultActiveTab.getAttribute('data-tab');
        if (tabKey === 'single') {
            showSingleTextMode(true);
        } else if (tabKey === 'double') {
            showDoubleTextMode(true);
        } else {
            renderHeroIcons();
        }
    } else {
        renderHeroIcons();
    }
        // --- Export SVG & PDF Functionality (based on jinkEGG.js) ---
        // --- Export SVG & PDF Functionality (based on jinkEGG.js) ---
        const exportSvgBtn = document.getElementById('export-svg-btn');
        const exportSingleSvgBtn = document.getElementById('export-single-svg-btn');
        const exportDualSvgBtn = document.getElementById('export-dual-svg-btn');

        function mmToPx(mm) {
            return mm * (96 / 25.4);
        }

// 1. New Helper: Fetch and Embed Font as Base64
// This prevents "incomplete load" by putting the font INSIDE the file.
let cachedFontCSS = null;
async function getEmbeddedFontCSS() {
    if (cachedFontCSS) return cachedFontCSS;
    
    const fontUrl = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
    
    try {
        // A. Fetch the CSS to find the true .woff2 URL
        const cssResp = await fetch(fontUrl);
        const cssText = await cssResp.text();
        const match = cssText.match(/url\((https:\/\/[^)]+\.woff2)\)/);
        
        if (!match) throw new Error('Could not find woff2 URL');
        
        // B. Fetch the actual font binary
        const fontResp = await fetch(match[1]);
        const fontBlob = await fontResp.blob();
        
        // C. Convert to Base64
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Create a robust @font-face rule
                const base64data = reader.result;
                const newRule = `
                    @font-face {
                        font-family: 'Material Symbols Outlined';
                        font-style: normal;
                        font-weight: 100 700;
                        src: url(${base64data}) format('woff2');
                    }
                `;
                cachedFontCSS = newRule;
                resolve(newRule);
            };
            reader.readAsDataURL(fontBlob);
        });
    } catch (e) {
        console.warn('Font embedding failed, using remote link fallback:', e);
        return `@import url('${fontUrl}');`;
    }
}

// Function to generate SVG based on current tab and content
async function generateCurrentSVG() {
    // Determine which tab is active
    let tabKey;
    const visiblePane = document.querySelector('.tab-pane:not(.hidden)');
    if (visiblePane) tabKey = visiblePane.getAttribute('data-tab');
    else {
        const activeTab = document.querySelector('.option-tab.active');
        tabKey = activeTab?.getAttribute('data-tab');
    }

    // Render correct overlay
    if (tabKey === 'single') renderSingleTextOverlay();
    else if (tabKey === 'double') renderDoubleTextOverlay();
    else renderHeroIcons();

    // Allow fonts to settle in the DOM (just in case)
    await new Promise(r => setTimeout(r, 100));

    const currentIconWeight = globalIconWeight || '400';
    const container = heroIconsContainer;
    if (!container) return null;

    const svgMm = 86;
    const strokeMm = 0.5;
    const pxPerMm = 96 / 25.4;
    const widthPx = Math.round(svgMm * pxPerMm);
    const heightPx = widthPx;
    const strokePx = Math.max(1, Math.round(strokeMm * pxPerMm));
    const containerRect = container.getBoundingClientRect();

    const xmlns = 'http://www.w3.org/2000/svg';
    const svgEl = document.createElementNS(xmlns, 'svg');
    svgEl.setAttribute('xmlns', xmlns);
    svgEl.setAttribute('width', `${svgMm}mm`);
    svgEl.setAttribute('height', `${svgMm}mm`);
    svgEl.setAttribute('viewBox', `0 0 ${widthPx} ${heightPx}`);

    // --- FIX: Wait for the embedded font CSS ---
    const fontCSS = await getEmbeddedFontCSS();

    const styleEl = document.createElementNS(xmlns, 'style');
    // Inject the Base64 font + helper classes
    styleEl.textContent = `${fontCSS} .icon{font-family: 'Material Symbols Outlined'; } .label{font-family: 'Inter', sans-serif;}`;
    svgEl.appendChild(styleEl);

    // Outer square
    const rect = document.createElementNS(xmlns, 'rect');
    rect.setAttribute('x', String(strokePx / 2));
    rect.setAttribute('y', String(strokePx / 2));
    rect.setAttribute('width', String(widthPx - strokePx));
    rect.setAttribute('height', String(heightPx - strokePx));
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', '#000');
    rect.setAttribute('stroke-width', String(strokePx));
    svgEl.appendChild(rect);

    const children = Array.from(container.children);
    children.forEach(child => {
        const childRect = child.getBoundingClientRect();
        const cx = (childRect.left + childRect.right) / 2 - containerRect.left;
        const cy = (childRect.top + childRect.bottom) / 2 - containerRect.top;
        const svgX = Math.round((cx / containerRect.width) * widthPx);
        const svgY = Math.round((cy / containerRect.height) * heightPx);

        // If it's an icon element
        if (child.querySelector && child.querySelector('.material-symbols-outlined')) {
            const span = child.querySelector('.material-symbols-outlined');
            const txt = span.textContent || span.innerText || '';
            let fs = child.style.fontSize;
            if (fs && fs.includes('rem')) {
                const remVal = parseFloat(fs);
                fs = (remVal * 16) + 'px';
            }
            const t = document.createElementNS(xmlns, 'text');
            t.setAttribute('x', String(svgX));
            t.setAttribute('y', String(svgY + Math.round(8 * pxPerMm / 3)));
            t.setAttribute('text-anchor', 'middle');
            t.setAttribute('fill', '#000');
            // Ensure font-family and weights are explicit
            t.setAttribute('style', `font-family: 'Material Symbols Outlined'; font-variation-settings: 'wght' ${currentIconWeight}; font-weight: ${currentIconWeight}; font-size: ${fs || '24px'};`);
            t.textContent = txt;
            svgEl.appendChild(t);
        } else {
            // treat as label/text
            const txt = child.textContent || child.innerText || '';
            if (!txt.trim()) return;
            
            let lines = [];
            const innerElems = child.querySelectorAll('div, span, p');
            if (innerElems && innerElems.length > 1) {
                innerElems.forEach(el => {
                    const t = (el.textContent || el.innerText || '').trim();
                    if (t) lines.push(t);
                });
            } else {
                lines = txt.split(/\n|\r/).map(s => s.trim()).filter(Boolean);
            }

            if (lines.length === 0) return;

            if (lines.length === 1) {
                const t = document.createElementNS(xmlns, 'text');
                t.setAttribute('x', String(svgX));
                t.setAttribute('y', String(svgY + Math.round(6 * pxPerMm / 3)));
                t.setAttribute('text-anchor', 'middle');
                t.setAttribute('fill', '#000');
                t.setAttribute('class', 'label');
                let fs = child.style.fontSize;
                if (fs && fs.includes('rem')) {
                    const remVal = parseFloat(fs);
                    fs = (remVal * 16) + 'px';
                }
                t.setAttribute('font-size', fs || '14px');
                t.setAttribute('font-weight', child.style.fontWeight || '400');
                t.textContent = lines[0];
                svgEl.appendChild(t);
            } else {
                const lineGap = Math.round(5 * pxPerMm / 2);
                lines.forEach((ln, idx) => {
                    const t = document.createElementNS(xmlns, 'text');
                    t.setAttribute('x', String(svgX));
                    const offset = (idx === 0) ? -lineGap : lineGap;
                    t.setAttribute('y', String(svgY + Math.round(offset)));
                    t.setAttribute('text-anchor', 'middle');
                    t.setAttribute('fill', '#000');
                    t.setAttribute('class', 'label');
                    let fs = child.style.fontSize;
                    if (fs && fs.includes('rem')) {
                        const remVal = parseFloat(fs);
                        fs = (remVal * 16) + 'px';
                    }
                    t.setAttribute('font-size', fs || '14px');
                    t.setAttribute('font-weight', child.style.fontWeight || '400');
                    t.textContent = ln;
                    svgEl.appendChild(t);
                });
            }
        }
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgEl);
}

// Wrapper to handle download
async function exportCurrentTabSVG() {
    const svgString = await generateCurrentSVG();
    if (!svgString) return;

    // Store SVG for PDF export if needed
    if (typeof currentSVGString !== 'undefined') {
        currentSVGString = svgString;
    }
    
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const dl = document.createElement('a');
    
    const colorText = heroColor?.textContent?.replace('Color: ', '').toLowerCase().replace(/\s+/g, '-') || 'color';
    const protocolText = heroProtocol?.textContent?.replace('Protocol: ', '').toLowerCase() || 'protocol';
    
    dl.href = url;
    dl.download = `matter-${protocolText}-${colorText}.svg`;
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    URL.revokeObjectURL(url);
    
    if (window.opener && window.opener.setSvgPreview) {
        window.opener.setSvgPreview(svgString);
    }
}

if (exportSvgBtn) exportSvgBtn.addEventListener('click', exportCurrentTabSVG);
if (exportSingleSvgBtn) exportSingleSvgBtn.addEventListener('click', exportCurrentTabSVG);
if (exportDualSvgBtn) exportDualSvgBtn.addEventListener('click', exportCurrentTabSVG);
        // --- PDF export ---
        const exportPdfBtn = document.getElementById('export-pdf-btn');
        const exportSinglePdfBtn = document.getElementById('export-single-pdf-btn');
        const exportDualPdfBtn = document.getElementById('export-dual-pdf-btn');
async function exportCurrentTabPDF() {
    // 1. Ensure correct overlay is rendered
    let tabKey;
    const visiblePane = document.querySelector('.tab-pane:not(.hidden)');
    if (visiblePane) tabKey = visiblePane.getAttribute('data-tab');
    else {
        const activeTab = document.querySelector('.option-tab.active');
        tabKey = activeTab?.getAttribute('data-tab');
    }

    if (tabKey === 'single') renderSingleTextOverlay();
    else if (tabKey === 'double') renderDoubleTextOverlay();
    else renderHeroIcons();

    // Wait for UI to update
    await new Promise(r => setTimeout(r, 150));
    if (!exportWrapper || !html2canvas) return;

    // --- STEP A: Capture the "Visual Render" (Color Product Image) ---
    const clone = exportWrapper.cloneNode(true);
    Object.assign(clone.style, {
        position: 'fixed', top: '0', left: '0', width: '400px', height: 'auto', 
        margin: '0', padding: '0', backgroundColor: '#ffffff', zIndex: '-5000', 
        display: 'block', borderRadius: '0'
    });
    
    const innerContainer = clone.querySelector('#export-container');
    if (innerContainer) {
        innerContainer.style.maxWidth = '400px';
        innerContainer.style.margin = '0';
        innerContainer.style.padding = '0';
    }
    document.body.appendChild(clone);
    
    let imgData = '';
    try {
        const canvas = await html2canvas(clone, { scale: 2, useCORS: true });
        imgData = canvas.toDataURL('image/png');
    } catch (e) { console.error('Visual render capture failed:', e); } 
    finally { clone.remove(); }

    // --- STEP B: Generate Technical Drawing (The Fix: DOM Clone Method) ---
    // Instead of rasterizing an SVG (which loses fonts), we clone the actual HTML icons
    // and style them as a black-and-white technical drawing.
    let techSvgImgData = '';
    const heroContainerSource = document.getElementById('hero-icons');
    
    if (heroContainerSource) {
        // 1. Create a container that mimics the Technical Drawing box
        const techContainer = document.createElement('div');
        Object.assign(techContainer.style, {
            position: 'fixed', top: '0', left: '0',
            width: '400px', height: '400px', // Square aspect ratio
            backgroundColor: '#ffffff',
            border: '2px solid #000', // Outer frame
            zIndex: '-5000',
            display: 'block',
            boxSizing: 'border-box' // Ensure border is included in width
        });

        // 2. Clone the icons/text from the main screen
        // We use the children because the parent container might have sizing issues
        const iconsClone = heroContainerSource.cloneNode(true);
        
        // 3. Style the inner container to fill the box
        Object.assign(iconsClone.style, {
            position: 'absolute', top: '0', left: '0',
            width: '100%', height: '100%',
            background: 'transparent'
        });

        // 4. Force all children to be Black & White (Wireframe style)
        // This handles both Icons (buttons) and Text overlays
        const allChildren = iconsClone.querySelectorAll('*');
        allChildren.forEach(el => {
            // --- FIX START: Remove text-white class ---
            // Bootstrap's .text-white is !important, so it overrides inline styles. 
            // We must remove it to allow the text to become black.
            el.classList.remove('text-white');
            // --- FIX END ---

            el.style.color = '#000000';
            el.style.textShadow = 'none';
            el.style.background = 'transparent';
            el.style.borderColor = 'transparent';
            // Ensure icons are visible
            if (el.classList.contains('material-symbols-outlined')) {
                el.style.color = '#000000';
                // Force font family to ensure it persists
                el.style.fontFamily = "'Material Symbols Outlined'"; 
            }
        });

        techContainer.appendChild(iconsClone);
        document.body.appendChild(techContainer);

        // 5. Capture it
        try {
            const techCanvas = await html2canvas(techContainer, { 
                scale: 2, 
                backgroundColor: '#ffffff' 
            });
            techSvgImgData = techCanvas.toDataURL('image/png');
        } catch (err) {
            console.error('Tech drawing capture failed:', err);
        } finally {
            techContainer.remove();
        }
    }

    // --- STEP C: Generate PDF ---
    const colorText = heroColor?.textContent?.replace('Color: ', '').toLowerCase().replace(/\s+/g, '-') || 'color';
    const protocolText = heroProtocol?.textContent?.replace('Protocol: ', '').toLowerCase() || 'protocol';
    const noteText = document.querySelector('input[name="protocol"]')?.value || '';
    const roomText = document.querySelector('input[name="room"]')?.value?.trim() || '';
    const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const generatedId = `KNXSTORE-${randomId}`;

    const iframe = document.createElement('iframe');
    // Mobile-safe hiding
    Object.assign(iframe.style, {
        position: 'fixed', left: '0', top: '0', width: '794px', height: '1123px',
        zIndex: '-10000', visibility: 'visible', border: 'none'
    });
    
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    iframeDoc.open();
    // (Keep the rest of your HTML string exactly as it was, no changes needed here)
    iframeDoc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>-</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        :root {
            --primary-dark: #1e293b;
            --text-secondary: #64748b;
            --border-color: #e2e8f0;
            --accent-bg: #f8fafc;
            --accent: #3498db;
            --accent-dark: #1a3a52;
        }

        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background-color: #f1f5f9;
            color: var(--primary-dark);
            font-size: 13.5px;
            line-height: 1.5;
            padding: 20px 12px;
        }

        .design-sheet {
            background-color: white;
            max-width: 900px;
            margin: 0 auto;
            padding: 28px 32px;
            border-radius: 10px;
            box-shadow: 0 8px 35px -10px rgba(0,0,0,0.07);
            position: relative;
            overflow: hidden;
        }

        .sheet-accent {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 5px;
            background: linear-gradient(90deg, #1a3a52 0%, #3498db 100%);
        }

        /* ── Original header preserved ──────────────────────────────────────── */
        .header-section {
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 18px;
            margin-bottom: 28px;
        }

        .contact-details {
            font-size: 11px;
            color: var(--text-secondary);
            text-align: right;
            line-height: 1.5;
        }

        .contact-details i {
            color: var(--accent-dark);
            margin-right: 6px;
        }

        .section-title {
            font-size: 10.5px;
            text-transform: uppercase;
            letter-spacing: 1.4px;
            font-weight: 700;
            color: #94a3b8;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }

        .section-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background-color: var(--border-color);
            margin-left: 12px;
        }

        .preview-card {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            height: 260px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .preview-card img {
            max-width: 94%;
            max-height: 94%;
            object-fit: contain;
        }

        .specs-box {
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
            background: white;
        }

        .spec-row {
            display: flex;
            border-bottom: 1px solid var(--border-color);
            font-size: 13px;
        }

        .spec-row:last-child {
            border-bottom: none;
        }

        .spec-label-col {
            width: 30%;
            background-color: var(--accent-bg);
            padding: 11px 16px;
            font-size: 10.5px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-right: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .spec-value-col {
            flex: 1;
            padding: 11px 16px;
            color: #334155;
            font-weight: 500;
            display: flex;
            align-items: center;
        }

        .color-preview {
            width: 14px;
            height: 14px;
            border-radius: 3px;
            box-shadow: inset 0 0 2px rgba(0,0,0,0.15);
            flex-shrink: 0;
        }

        .sheet-footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #94a3b8;
        }

        .id-code {
            font-family: 'Courier New', monospace;
            font-weight: 600;
            color: var(--primary-dark);
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
        }

        @media (max-width: 992px) {
            .design-sheet { padding: 24px 20px; }
            .preview-card { height: 240px; }
        }

        @media (max-width: 768px) {
            .header-section {
                flex-direction: column !important;
                align-items: flex-start !important;
                text-align: left !important;
            }
            .contact-details { text-align: left; margin-top: 12px; }
            .preview-card { height: 220px; }
            .spec-label-col { width: 36%; }
        }

        @media (max-width: 576px) {
            .design-sheet { border-radius: 0; margin: 0 -12px; }
        }
    </style>
</head>
<body>

<div class="design-sheet">
    <div class="sheet-accent"></div>

    <!-- Original header kept almost identical -->
    <div class="header-section d-flex justify-content-between align-items-end">
        <div>
            <img src="src/imgs/KNX STORE_Logo 2.png" alt="KNX Store Logo" style="height: 26px; width: auto; margin-bottom: 6px;">
            <div style="font-size: 11px; font-weight: 600; color: #1a3a52; margin-top: 4px;">DALI 2 UITIOT SP3112 CONFIGURATION</div>
        </div>
        <div class="contact-details">
            <div class="d-flex align-items-center gap-1">
                <i class="bi bi-globe"></i>
                <a href="https://knxstore.vn" target="_blank">knxstore.vn</a>
            </div>
            <div><i class="bi bi-geo-alt-fill"></i> SAV5.01-02 The Sun Avenue, 28 Mai Chí Thọ, Phường Bình Trưng, TP.HCM</div>
            <div><i class="bi bi-telephone-fill"></i> 0918.918.755 &nbsp;|&nbsp; <i class="bi bi-envelope-fill"></i> sales@knxstore.vn</div>
        </div>
    </div>


    


    <div class="row g-4 mb-5">
    <div class="col-6 col-md-6">
        <div class="section-title">Visual Render</div>
        <div class="preview-card">
            <img src="${imgData}" alt="Render" class="img-fluid">
        </div>
    </div>
    <div class="col-6 col-md-6">
        <div class="section-title">Technical Drawing</div>
        <div class="preview-card">
            <img src="${techSvgImgData}" alt="Technical Drawing" class="img-fluid">
        </div>
    </div>
</div>


    <!-- Specs -->
    <div class="row">
        <div class="col-12">
            <div class="section-title">Technical Specifications</div>
            <div class="specs-box">
                <div class="spec-row">
                    <div class="spec-label-col"><i class="bi bi-tag-fill"></i> Product</div>
                    <div class="spec-value-col">DALI 2 UITIOT SP 3118 - Keypad</div>
                </div>
                <div class="spec-row">
                    <div class="spec-label-col"><i class="bi bi-palette-fill"></i> Color</div>
                    <div class="spec-value-col">
                        <span class="color-preview" style="background-color:#333;"></span>
                        ${colorText.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </div>
                </div>
                <div class="spec-row">
                    <div class="spec-label-col"><i class="bi bi-arrows-fullscreen"></i> Dimensions</div>
                    <div class="spec-value-col" style="color: #1a3a52; font-style: italic;">86 × 86 mm <span style="color:#94a3b8; font-size:11px; margin-left:6px;">(EU Standard)</span></div>
                </div>
                <div class="spec-row">
                    <div class="spec-label-col"><i class="bi bi-pencil-square"></i> Room</div>
                    <div class="spec-value-col" style="color: #1a3a52; font-style: italic;">${noteText || '—'}</div>
                </div>
                <div class="spec-row">
                    <div class="spec-label-col"><i class="bi bi-geo-alt-fill"></i> ID/Location</div>
                    <div class="spec-value-col" style="color: #1a3a52; font-style: italic;">${roomText || '—'}</div>
                </div>
            </div>
        </div>  
    </div>

        <p class="pt-4" style="font-size: 11px; color: #64748b;">
            Once you have finished your selection, please send both files (PDF and SVG) via
            <a href="https://zalo.me/0918918755" target="_blank" rel="noopener noreferrer">ZALO</a>
            or email:
            <a href="mailto:sales@knxstore.vn">sales@knxstore.vn</a>
        </p>


    <div class="sheet-footer">
        

        <div>Generated by KNX Store Configurator</div>

        <div>ID: <span class="id-code">${generatedId}</span></div>
    </div>
</div>

</body>
</html>`);
    
   iframeDoc.close();

    // --- STEP D: Save PDF ---
    setTimeout(async () => {
        try {
            const iframeBody = iframeDoc.body;
            const iframeCanvas = await html2canvas(iframeBody, { 
                scale: 2, 
                useCORS: true,
                windowWidth: 794 
            });
            const pdfImgData = iframeCanvas.toDataURL('image/png');

            if (window.jsPDF) {
                const { jsPDF } = window;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const imgHeight = (iframeCanvas.height * imgWidth) / iframeCanvas.width;
                pdf.addImage(pdfImgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save(`matter-${colorText}-${protocolText}-${generatedId}.pdf`);
            } else {
                iframe.contentWindow.print();
            }
        } catch (err) {
            console.error('PDF export failed', err);
        } finally {
            setTimeout(() => document.body.removeChild(iframe), 2000);
        }
    }, 800);
}
        if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportCurrentTabPDF);
        if (exportSinglePdfBtn) exportSinglePdfBtn.addEventListener('click', exportCurrentTabPDF);
        if (exportDualPdfBtn) exportDualPdfBtn.addEventListener('click', exportCurrentTabPDF);
});