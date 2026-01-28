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
    const protocolRadios = document.querySelectorAll('input[name="name_position"]');
    protocolRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (heroProtocol) heroProtocol.textContent = `Note: ${this.value}`;
        });
    });

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
    function renderHeroIcons(limit = 4) {
        if (!heroIconsContainer) return;
        const asideIconButtons = Array.from(document.querySelectorAll('#icon-grid .icon-btn'));
        heroIconsContainer.innerHTML = '';
        // For 4 icons place them centered in each 2x2 cell (use center percentages)
        const positions = [
            { left: '25%', top: '25%' },
            { left: '75%', top: '25%' },
            { left: '25%', top: '75%' },
            { left: '75%', top: '75%' }
        ];

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
            heroBtn.style.transition = 'transform 0.18s ease';
            heroBtn.onmouseover = () => heroBtn.style.transform = 'translate(-50%, -50%) scale(1.12)';
            heroBtn.onmouseout = () => heroBtn.style.transform = 'translate(-50%, -50%) scale(1)';

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
            // center the button on the coordinate
            heroBtn.style.transform = 'translate(-50%, -50%) scale(1)';

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
    const singleInputs = Array.from({ length: 4 }, (_, i) => document.getElementById(`single-input-${i+1}`));

    function renderSingleTextOverlay() {
        if (!heroIconsContainer) return;

        let weight = '400';
        const checked = document.querySelector('input[name="single-text-weight"]:checked');
        if (checked) weight = checked.value;

        let sizeClass = 'text-sm';
        const checkedSize = document.querySelector('input[name="single-text-size"]:checked');
        if (checkedSize) sizeClass = checkedSize.value;

        // center positions for 2x2 grid
        const positions = [
            { left: '25%', top: '25%' },
            { left: '75%', top: '25%' },
            { left: '25%', top: '75%' },
            { left: '75%', top: '75%' }
        ];

        heroIconsContainer.innerHTML = '';

        for (let i = 0; i < 4; i++) {
            const val = (singleInputs[i] && singleInputs[i].value) ? singleInputs[i].value : '';

            const el = document.createElement('div');
            el.className = `hero-text position-absolute d-inline-flex align-items-center justify-content-center text-center px-2 py-1 rounded text-white`;
            el.dataset.index = String(i);
            el.style.fontWeight = weight;
            el.style.fontVariationSettings = `'wght' ${weight}`;
            el.style.fontSize = fontSizeMap[sizeClass] || '0.875rem';
            el.style.whiteSpace = 'pre-wrap';

            const pos = positions[i] || positions[0];
            Object.keys(pos).forEach(k => { el.style[k] = pos[k]; });
            el.style.transform = 'translate(-50%, -50%)';

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

    // --- Double Line Overlay (4 cells, 2 lines each) ---
    const doubleInputs = Array.from({ length: 8 }, (_, i) => document.getElementById(`double-input-${i+1}`));

    function renderDoubleTextOverlay() {
        if (!heroIconsContainer) return;

        let weight = '400';
        const checked = document.querySelector('input[name="double-text-weight"]:checked');
        if (checked) weight = checked.value;

        let sizeClass = 'text-sm';
        const checkedSize = document.querySelector('input[name="double-text-size"]:checked');
        if (checkedSize) sizeClass = checkedSize.value;

        // center positions for 4 cells (2x2)
        const positions = [
            { left: '25%', top: '25%' },
            { left: '75%', top: '25%' },
            { left: '25%', top: '75%' },
            { left: '75%', top: '75%' }
        ];

        heroIconsContainer.innerHTML = '';

        for (let i = 0; i < 4; i++) {
            const lineA = (doubleInputs[i] && doubleInputs[i].value) ? doubleInputs[i].value : '';
            const lineB = (doubleInputs[i + 4] && doubleInputs[i + 4].value) ? doubleInputs[i + 4].value : '';
            const isLeft = i % 2 === 0;
            const alignClass = isLeft ? 'justify-content-start text-start' : 'justify-content-end text-end';

            const el = document.createElement('div');
            el.className = `hero-text position-absolute d-inline-flex flex-column align-items-center justify-content-center text-center px-2 py-1 rounded text-white`;
            el.dataset.index = String(i);
            el.style.fontWeight = weight;
            el.style.fontVariationSettings = `'wght' ${weight}`;
            el.style.fontSize = fontSizeMap[sizeClass] || '0.875rem';

            const pos = positions[i] || positions[0];
            Object.keys(pos).forEach(k => { el.style[k] = pos[k]; });
            el.style.transform = 'translate(-50%, -50%)';

            // Create stacked lines
            const a = document.createElement('div');
            a.textContent = lineA;
            const b = document.createElement('div');
            b.textContent = lineB;
            a.style.lineHeight = '1.1';
            b.style.lineHeight = '1.1';
            a.style.textAlign = 'center';
            b.style.textAlign = 'center';
            el.appendChild(a);
            el.appendChild(b);

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
            link.href = canvas.toDataURL('image/png');
            link.click();

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
        const exportSvgBtn = document.getElementById('export-svg-btn');
        const exportSingleSvgBtn = document.getElementById('export-single-svg-btn');
        const exportDualSvgBtn = document.getElementById('export-dual-svg-btn');

        function mmToPx(mm) {
            return mm * (96 / 25.4);
        }

        async function exportCurrentTabSVG() {
            // Prefer the visible pane (more reliable); fallback to the tab button
            let tabKey;
            const visiblePane = document.querySelector('.tab-pane:not(.hidden)');
            if (visiblePane) tabKey = visiblePane.getAttribute('data-tab');
            else {
                const activeTab = document.querySelector('.option-tab.active');
                tabKey = activeTab?.getAttribute('data-tab');
            }

            // ensure correct overlay rendered
            if (tabKey === 'single') renderSingleTextOverlay();
            else if (tabKey === 'double') renderDoubleTextOverlay();
            else renderHeroIcons();

            // allow fonts to settle
            await new Promise(r => setTimeout(r, 100));

            const currentIconWeight = globalIconWeight || '400';

            const container = heroIconsContainer;
            if (!container) return;

            const svgMm = 90;
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

            // Embed minimal CSS to load Material Symbols for .icon only
            const styleEl = document.createElementNS(xmlns, 'style');
            styleEl.textContent = `@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'); .icon{font-family: 'Material Symbols Outlined'; } .label{font-family: 'Inter', sans-serif;}`;
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

                // If it's an icon element (material-symbols span or button with span)
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
                    t.setAttribute('y', String(svgY + Math.round(8 * pxPerMm / 3))); // small vertical offset
                    t.setAttribute('text-anchor', 'middle');
                    t.setAttribute('fill', '#000');
                    t.setAttribute('style', `font-family: 'Material Symbols Outlined'; font-variation-settings: 'wght' ${currentIconWeight}; font-weight: ${currentIconWeight}; font-size: ${fs || '24px'};`);
                    t.textContent = txt;
                    svgEl.appendChild(t);
                } else {
                    // treat as label/text (single or double)
                    const txt = child.textContent || child.innerText || '';
                    if (!txt.trim()) return;

                    // Prefer explicit stacked children (double mode creates inner divs)
                    let lines = [];
                    const innerElems = child.querySelectorAll('div, span, p');
                    if (innerElems && innerElems.length > 1) {
                        innerElems.forEach(el => {
                            const t = (el.textContent || el.innerText || '').trim();
                            if (t) lines.push(t);
                        });
                    } else {
                        // Fallback to splitting by newline if no stacked children
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
                        // stack two lines vertically — increase gap for readability
                        const lineGap = Math.round(5 * pxPerMm / 2); // larger gap in px
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
            const svgString = serializer.serializeToString(svgEl);
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const dl = document.createElement('a');
            const colorText = heroColor?.textContent?.replace('Color: ', '').toLowerCase().replace(/\s+/g, '-') || 'color';
            const protocolText = heroProtocol?.textContent?.replace('Protocol: ', '').toLowerCase() || 'protocol';
            dl.href = url;
            dl.download = `uitiot-${protocolText}-${colorText}.svg`;
            document.body.appendChild(dl);
            dl.click();
            dl.remove();
            URL.revokeObjectURL(url);
        }

        if (exportSvgBtn) exportSvgBtn.addEventListener('click', exportCurrentTabSVG);
        if (exportSingleSvgBtn) exportSingleSvgBtn.addEventListener('click', exportCurrentTabSVG);
        if (exportDualSvgBtn) exportDualSvgBtn.addEventListener('click', exportCurrentTabSVG);

        // --- PDF export ---
        const exportPdfBtn = document.getElementById('export-pdf-btn');
        const exportSinglePdfBtn = document.getElementById('export-single-pdf-btn');
        const exportDualPdfBtn = document.getElementById('export-dual-pdf-btn');

        async function exportCurrentTabPDF() {
            // Prefer the visible pane (more reliable); fallback to the tab button
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

            await new Promise(r => setTimeout(r, 120));

            if (!exportWrapper || !html2canvas) return;

            const clone = exportWrapper.cloneNode(true);
            Object.assign(clone.style, {
                position: 'fixed', top: '0', left: '0', width: '400px', height: 'auto', margin: '0', padding: '0', backgroundColor: '#ffffff', zIndex: '9999', display: 'block', borderRadius: '0'
            });

            // adjust inner container styles if present
            const innerContainer = clone.querySelector('#export-container');
            if (innerContainer) {
                innerContainer.style.maxWidth = '400px';
                innerContainer.style.margin = '0';
                innerContainer.style.padding = '0';
            }

            document.body.appendChild(clone);

            try {
                const canvas = await html2canvas(clone, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const svgMm = 90;
                const { jsPDF } = window.jspdf || {};
                if (!jsPDF) {
                    console.warn('jsPDF not found');
                    return;
                }
                const pdf = new jsPDF({ unit: 'mm', format: [svgMm, svgMm] });
                pdf.addImage(imgData, 'PNG', 0, 0, svgMm, svgMm);
                const colorText = heroColor?.textContent?.replace('Color: ', '').toLowerCase().replace(/\s+/g, '-') || 'color';
                const protocolText = heroProtocol?.textContent?.replace('Protocol: ', '').toLowerCase() || 'protocol';
                pdf.save(`uitiot-${protocolText}-${colorText}.pdf`);
            } catch (err) {
                console.error('PDF export failed', err);
            } finally {
                clone.remove();
            }
        }

        if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportCurrentTabPDF);
        if (exportSinglePdfBtn) exportSinglePdfBtn.addEventListener('click', exportCurrentTabPDF);
        if (exportDualPdfBtn) exportDualPdfBtn.addEventListener('click', exportCurrentTabPDF);

});