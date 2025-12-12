// ===== إدارة ثيمات الموقع (Dark/Light Mode) =====
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        // تعيين الثيم الحالي
        this.setTheme(this.currentTheme);
        
        // إضافة حدث التبديل
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // مراقبة تغيير الثيم في النظام
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        
        // تحديث زر التبديل
        this.updateToggleButton();
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // تأثير تحول سلس
        document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }
    
    updateToggleButton() {
        const icon = this.themeToggle.querySelector('i');
        icon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            icon.style.transform = 'rotate(0deg)';
        }, 300);
    }
}

// ===== إدارة شريط التقدم =====
class ProgressBar {
    constructor() {
        this.progressBar = document.getElementById('progressBar');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.updateProgressBar());
        this.updateProgressBar();
    }
    
    updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        this.progressBar.style.width = `${progress}%`;
        
        // إظهار/إخفاء زر الانتقال للأعلى
        const scrollTopBtn = document.querySelector('.scroll-top-btn');
        if (scrollTopBtn) {
            if (scrolled > 500) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        }
    }
}

// ===== إدارة السلايدر =====
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.prev-slide');
        this.nextBtn = document.querySelector('.next-slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // عرض الشريحة الأولى
        this.showSlide(this.currentSlide);
        
        // إضافة أحداث الأزرار
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // إضافة أحداث المؤشرات
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // بدء التشغيل التلقائي
        this.startAutoSlide();
        
        // إيقاف التشغيل التلقائي عند التمرير
        this.setupPauseOnHover();
        
        // دعم اللمس للجوال
        this.setupTouchEvents();
    }
    
    showSlide(index) {
        // التأكد من أن الفهرس ضمن النطاق
        if (index >= this.slides.length) index = 0;
        if (index < 0) index = this.slides.length - 1;
        
        // إخفاء جميع الشرائح
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });
        
        // إزالة النشاط من جميع المؤشرات
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // عرض الشريحة الحالية
        this.currentSlide = index;
        this.slides[index].classList.add('active');
        this.slides[index].style.opacity = '1';
        this.indicators[index].classList.add('active');
    }
    
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
        this.resetAutoSlide();
    }
    
    prevSlide() {
        this.showSlide(this.currentSlide - 1);
        this.resetAutoSlide();
    }
    
    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoSlide();
    }
    
    startAutoSlide() {
        // تبديل تلقائي كل 5 ثواني
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    resetAutoSlide() {
        clearInterval(this.slideInterval);
        this.startAutoSlide();
    }
    
    setupPauseOnHover() {
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(this.slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
        }
    }
    
    setupTouchEvents() {
        const sliderContainer = document.querySelector('.slider-container');
        if (!sliderContainer) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide(); // سحب لليسار
            } else {
                this.prevSlide(); // سحب لليمين
            }
        }
    }
}

// ===== إدارة معرض الأعمال =====
class PortfolioManager {
    constructor() {
        this.projects = this.loadProjects();
        this.currentFilter = 'all';
        this.init();
    }
    
    init() {
        this.setupFiltering();
        this.setupLikeButtons();
        this.setupViewButtons();
        this.setupInquiryButtons();
        this.setupModals();
        this.setupInquiryForm();
        this.setupLoadMore();
    }
    
    loadProjects() {
        return [
            {
                id: 1,
                title: "فيلا سكنية فاخرة",
                category: "villa",
                location: "حي الروضة، جدة",
                area: "450م²",
                year: "2023",
                rating: 4.8,
                likes: 42,
                description: "تصميم عصري بلمسات تراثية، دمج بين الفخامة والراحة مع مراعاة مناخ جدة الساحلي. تم استخدام مواد مقاومة للرطوبة وإضاءة ذكية يمكن التحكم بها عن بعد.",
                tags: ["عصري", "مقاوم للرطوبة", "إضاءة ذكية", "تراثي"],
                images: [
                    "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                ],
                features: [
                    "مواد مقاومة للرطوبة والعفن",
                    "نظام إضاءة ذكي قابل للبرمجة",
                    "تكييف مركزي متطور",
                    "أرضيات من الباركيه الفاخر",
                    "مطبخ مجهز بأحدث الأجهزة"
                ],
                clientReview: "كان العمل مع فريق ديكور آرت جدة تجربة رائعة. فهموا متطلباتنا تماماً وأنتجوا مساحة تتجاوز توقعاتنا."
            },
            {
                id: 2,
                title: "شقة ساحلية راقية",
                category: "apartment",
                location: "الكورنيش، جدة",
                area: "180م²",
                year: "2024",
                rating: 4.9,
                likes: 38,
                description: "تصميم ساحلي مع مواد مقاومة للرطوبة، إطلالة بانورامية على البحر الأحمر. تم التركيز على التهوية الطبيعية والإضاءة الذكية.",
                tags: ["ساحلي", "مقاوم للملوحة", "إطلالة بحر", "حديث"],
                images: [
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1544552866-d3ed42536d89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                ],
                features: [
                    "نوافذ مقاومة للملوحة",
                    "نظام تهوية طبيعية محسن",
                    "إضاءة LED ذكية",
                    "أرضيات من السيراميك المقاوم للانزلاق",
                    "نظام تحكم ذكي في المناخ"
                ],
                clientReview: "الشقة الآن أجمل مما تخيلت! التصميم يناسب جو جدة الساحلي تماماً."
            },
            {
                id: 3,
                title: "ترميم فيلا تراثية",
                category: "villa",
                location: "جدة التاريخية",
                area: "320م²",
                year: "2022",
                rating: 5.0,
                likes: 56,
                description: "ترميم مع الحفاظ على الطابع التراثي، تجديد الرواشين والأفنية الداخلية. تم استخدام مواد بناء تقليدية مع تقنيات حديثة.",
                tags: ["تراثي", "ترميم", "خشب طبيعي", "تقليدي"],
                images: [
                    "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                ],
                features: [
                    "ترميم الرواشين الخشبية الأصلية",
                    "استخدام الحجر المنقبي التقليدي",
                    "نظام عزل حراري حديث",
                    "إضاءة محافظة على الطابع التراثي",
                    "تحديث أنظمة السباكة والكهرباء"
                ],
                clientReview: "أعادوا الحياة إلى منزل العائلة مع الحفاظ على كل الذكريات. عمل احترافي جداً."
            },
            {
                id: 4,
                title: "مقر شركة تقنية",
                category: "office",
                location: "حي الصحيفة، جدة",
                area: "800م²",
                year: "2023",
                rating: 4.7,
                likes: 29,
                description: "تصميم مكتب مفتوح مع مساحات تعاونية، إضاءة ذكية، وتقنيات متطورة. ركز التصميم على الإنتاجية والراحة.",
                tags: ["مكتب مفتوح", "تقني", "إضاءة LED", "حديث"],
                images: [
                    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                ],
                features: [
                    "مساحات عمل تعاونية مرنة",
                    "نظام إضاءة ذكي يحاكي ضوء النهار",
                    "غرف اجتماعات ذكية",
                    "مناطق استراحة مريحة",
                    "نظام صوتي متكامل"
                ],
                clientReview: "المكتب الآن بيئة عمل محفزة للإبداع والإنتاجية. الموظفون سعداء بالمساحات الجديدة."
            }
        ];
    }
    
    setupFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // إزالة النشاط من جميع الأزرار
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // إضافة النشاط للزر المضغوط
                button.classList.add('active');
                
                // تحديث الفلتر الحالي
                this.currentFilter = button.dataset.filter;
                
                // تصفية المشاريع
                this.filterProjects();
            });
        });
    }
    
    filterProjects() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            const category = item.dataset.category;
            
            if (this.currentFilter === 'all' || category === this.currentFilter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    setupLikeButtons() {
        document.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) {
                this.handleLike(likeBtn);
            }
        });
    }
    
    handleLike(likeBtn) {
        const likeCount = likeBtn.querySelector('.like-count');
        let count = parseInt(likeCount.textContent);
        
        if (likeBtn.classList.contains('liked')) {
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '<i class="far fa-heart"></i><span class="like-count">' + (count - 1) + '</span>';
        } else {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '<i class="fas fa-heart"></i><span class="like-count">' + (count + 1) + '</span>';
        }
        
        // تأثير النقر
        likeBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            likeBtn.style.transform = 'scale(1)';
        }, 300);
        
        // حفظ في localStorage
        this.saveLike(likeBtn);
    }
    
    saveLike(likeBtn) {
        const projectId = likeBtn.closest('.portfolio-item').dataset.id;
        const liked = likeBtn.classList.contains('liked');
        const likes = JSON.parse(localStorage.getItem('projectLikes') || '{}');
        
        likes[projectId] = liked;
        localStorage.setItem('projectLikes', JSON.stringify(likes));
    }
    
    setupViewButtons() {
        document.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.quick-view-btn, .details-btn');
            if (viewBtn) {
                const projectId = viewBtn.closest('.portfolio-item').dataset.id;
                this.openProjectModal(projectId);
            }
        });
    }
    
    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id == projectId);
        if (!project) return;
        
        const modal = document.getElementById('projectModal');
        const modalContent = modal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div class="project-modal-content">
                <h2 class="modal-title">${project.title}</h2>
                
                <div class="project-slider">
                    <div class="slider-main">
                        <img src="${project.images[0]}" alt="${project.title}" id="mainImage" loading="lazy">
                    </div>
                    <div class="slider-thumbs">
                        ${project.images.map((img, index) => `
                            <img src="${img}" alt="صورة ${index + 1}" 
                                 class="thumb ${index === 0 ? 'active' : ''}"
                                 data-index="${index}"
                                 loading="lazy">
                        `).join('')}
                    </div>
                </div>
                
                <div class="project-details">
                    <div class="details-grid">
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <h5>الموقع</h5>
                                <p>${project.location}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-ruler-combined"></i>
                            <div>
                                <h5>المساحة</h5>
                                <p>${project.area}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <div>
                                <h5>سنة التنفيذ</h5>
                                <p>${project.year}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-star"></i>
                            <div>
                                <h5>التقييم</h5>
                                <p>${project.rating} / 5</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-description-full">
                        <h4>وصف المشروع</h4>
                        <p>${project.description}</p>
                    </div>
                    
                    <div class="project-features">
                        <h4>المميزات الرئيسية</h4>
                        <ul>
                            ${project.features.map(feature => `
                                <li><i class="fas fa-check"></i> ${feature}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-tags">
                        ${project.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    
                    ${project.clientReview ? `
                        <div class="client-review">
                            <h4>رأي العميل</h4>
                            <div class="review-content">
                                <i class="fas fa-quote-right"></i>
                                <p>"${project.clientReview}"</p>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="modal-actions">
                        <button class="inquire-btn" onclick="portfolioManager.openInquiryModal(${project.id})">
                            <i class="fas fa-comment"></i> استفسر عن مشروع مماثل
                        </button>
                        <button class="share-btn" onclick="portfolioManager.shareProject(${project.id})">
                            <i class="fas fa-share-alt"></i> شارك المشروع
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // إعداد السلايدر
        this.setupProjectSlider();
        
        // إظهار المودال
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    setupProjectSlider() {
        const thumbs = document.querySelectorAll('.slider-thumbs .thumb');
        const mainImage = document.getElementById('mainImage');
        
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // إزالة النشاط من جميع الصور المصغرة
                thumbs.forEach(t => t.classList.remove('active'));
                
                // إضافة النشاط للصورة المحددة
                thumb.classList.add('active');
                
                // تغيير الصورة الرئيسية
                mainImage.src = thumb.src;
                
                // تأثير الانتقال
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 200);
            });
        });
    }
    
    setupInquiryButtons() {
        document.addEventListener('click', (e) => {
            const inquireBtn = e.target.closest('.inquire-btn');
            if (inquireBtn && !inquireBtn.classList.contains('modal-actions')) {
                const projectId = inquireBtn.dataset.project;
                this.openInquiryModal(projectId);
            }
        });
    }
    
    openInquiryModal(projectId) {
        const modal = document.getElementById('inquiryModal');
        const form = document.getElementById('inquiryForm');
        const project = this.projects.find(p => p.id == projectId);
        
        if (project) {
            form.querySelector('#inquiryProjectId').value = projectId;
            
            // تعبئة نوع المشروع تلقائياً
            const typeSelect = form.querySelector('#inquiryType');
            typeSelect.value = project.category;
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    setupModals() {
        const modals = document.querySelectorAll('.project-modal, .inquiry-modal');
        const closeButtons = document.querySelectorAll('.modal-close, .modal-overlay');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
                document.body.style.overflow = 'auto';
            });
        });
        
        // إغلاق بالضغط على زر ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    setupInquiryForm() {
        const form = document.getElementById('inquiryForm');
        const whatsappBtn = document.getElementById('whatsappInquiry');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitInquiryForm(form);
        });
        
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                this.submitViaWhatsApp(form);
            });
        }
    }
    
    submitInquiryForm(form) {
        const formData = {
            projectId: form.querySelector('#inquiryProjectId').value,
            name: form.querySelector('#inquiryName').value.trim(),
            phone: form.querySelector('#inquiryPhone').value.trim(),
            email: form.querySelector('#inquiryEmail').value.trim(),
            type: form.querySelector('#inquiryType').value,
            area: form.querySelector('#inquiryArea').value.trim(),
            budget: form.querySelector('#inquiryBudget').value,
            message: form.querySelector('#inquiryMessage').value.trim(),
            date: new Date().toISOString(),
            source: 'website_form'
        };
        
        // التحقق من البيانات
        if (!this.validateInquiryForm(formData)) {
            return;
        }
        
        // هنا يمكنك إرسال البيانات إلى الخادم
        console.log('تم إرسال الاستفسار:', formData);
        
        // إظهار رسالة نجاح
        this.showNotification('تم إرسال استفسارك بنجاح! سنتواصل معك خلال 24 ساعة عمل.', 'success');
        
        // إغلاق المودال وإعادة تعيين النموذج
        document.getElementById('inquiryModal').style.display = 'none';
        form.reset();
        document.body.style.overflow = 'auto';
        
        // حفظ في localStorage
        this.saveInquiry(formData);
        
        // إرسال إشعار (اختياري)
        this.sendNotification(formData);
    }
    
    validateInquiryForm(data) {
        if (!data.name || data.name.length < 2) {
            this.showNotification('يرجى إدخال اسم صحيح (على الأقل حرفين)', 'error');
            return false;
        }
        
        if (!data.phone || !/^(05|5|9665|\+9665)[0-9]{8}$/.test(data.phone)) {
            this.showNotification('يرجى إدخال رقم جوال سعودي صحيح', 'error');
            return false;
        }
        
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            this.showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return false;
        }
        
        return true;
    }
    
    submitViaWhatsApp(form) {
        const phone = form.querySelector('#inquiryPhone').value.trim();
        const name = form.querySelector('#inquiryName').value.trim();
        const type = form.querySelector('#inquiryType').value;
        const message = form.querySelector('#inquiryMessage').value.trim();
        
        if (!phone || !/^(05|5|9665|\+9665)[0-9]{8}$/.test(phone)) {
            this.showNotification('يرجى إدخال رقم جوال سعودي صحيح أولاً', 'error');
            return;
        }
        
        if (!name) {
            this.showNotification('يرجى إدخال اسمك أولاً', 'error');
            return;
        }
        
        const projectId = form.querySelector('#inquiryProjectId').value;
        const project = this.projects.find(p => p.id == projectId);
        const projectTitle = project ? project.title : 'مشروع جديد';
        
        const whatsappMessage = `مرحباً، أنا ${name}

أود الاستفسار عن مشروع ${type}
${projectTitle ? `المشروع المرجعي: ${projectTitle}` : ''}

${message ? `التفاصيل الإضافية:\n${message}` : ''}

رقم الجوال: ${phone}`;
        
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/966535544019?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    
    saveInquiry(inquiry) {
        const inquiries = JSON.parse(localStorage.getItem('portfolioInquiries') || '[]');
        inquiries.push(inquiry);
        localStorage.setItem('portfolioInquiries', JSON.stringify(inquiries.slice(-50))); // حفظ آخر 50 استفسار
    }
    
    sendNotification(data) {
        // هنا يمكنك إضافة كود لإرسال إشعار بالبريد الإلكتروني
        console.log('إشعار: تم استلام استفسار جديد من', data.name);
    }
    
    shareProject(projectId) {
        const project = this.projects.find(p => p.id == projectId);
        if (!project) return;
        
        const shareData = {
            title: project.title,
            text: `شاهد مشروع ${project.title} في ديكور آرت جدة`,
            url: window.location.href + `#project-${projectId}`
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('تم المشاركة بنجاح'))
                .catch(error => console.log('حدث خطأ في المشاركة:', error));
        } else {
            // نسخ الرابط إذا لم يكن المشاركة مدعومة
            navigator.clipboard.writeText(shareData.url)
                .then(() => this.showNotification('تم نسخ رابط المشروع إلى الحافظة', 'success'))
                .catch(err => console.error('خطأ في النسخ:', err));
        }
    }
    
    setupLoadMore() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProjects();
            });
        }
    }
    
    loadMoreProjects() {
        // هنا يمكنك تحميل المزيد من المشاريع من الخادم
        const loadMoreBtn = document.querySelector('.load-more-btn');
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            // محاكاة تحميل البيانات
            this.showNotification('سيتم إضافة المزيد من المشاريع قريباً', 'info');
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> عرض المزيد من المشاريع';
            loadMoreBtn.disabled = false;
        }, 1500);
    }
    
    showNotification(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // أيقونة حسب النوع
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <span>${icons[type] || icons.info}</span>
            <span>${message}</span>
            <button class="notification-close">×</button>
        `;
        
        // التنسيق
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: ${type === 'error' ? '#fee' : type === 'success' ? '#efe' : type === 'warning' ? '#ffeaa7' : '#e8f4fd'};
            color: ${type === 'error' ? '#c0392b' : type === 'success' ? '#27ae60' : type === 'warning' ? '#e17055' : '#0a58ca'};
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s ease;
            border-right: 4px solid ${this.getNotificationColor(type)};
            font-family: 'Cairo', sans-serif;
            min-width: 300px;
            max-width: 90vw;
            font-weight: 500;
        `;
        
        // إضافة للصفحة
        document.body.appendChild(notification);
        
        // إظهار بالإنتقال
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // زر الإغلاق
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.closeNotification(notification);
        });
        
        // إغلاق تلقائي بعد 5 ثواني
        setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);
    }
    
    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#c0392b',
            warning: '#e17055',
            info: '#0a58ca'
        };
        return colors[type] || colors.info;
    }
    
    closeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// ===== إدارة القائمة للجوال =====
class MobileMenu {
    constructor() {
        this.menuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }
    
    init() {
        if (!this.menuBtn || !this.navMenu) return;
        
        this.menuBtn.addEventListener('click', () => this.toggleMenu());
        
        // إغلاق القائمة عند النقر على رابط
        const navLinks = this.navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // إغلاق القائمة عند التمرير
        window.addEventListener('scroll', () => this.closeMenu());
    }
    
    toggleMenu() {
        this.menuBtn.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        this.menuBtn.setAttribute('aria-expanded', this.menuBtn.classList.contains('active'));
        
        // منع التمرير عند فتح القائمة
        document.body.style.overflow = this.menuBtn.classList.contains('active') ? 'hidden' : 'auto';
    }
    
    closeMenu() {
        this.menuBtn.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
    }
}

// ===== إدارة البحث =====
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchBtn = document.querySelector('.search-submit-btn');
        this.init();
    }
    
    init() {
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.performSearch());
        }
        
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
            
            // البحث التلقائي عند الكتابة
            this.searchInput.addEventListener('input', () => {
                this.handleSearchInput();
            });
        }
    }
    
    performSearch() {
        const query = this.searchInput ? this.searchInput.value.trim() : '';
        
        if (query) {
            // حفظ البحث الأخير
            localStorage.setItem('lastSearch', query);
            
            // إظهار نتائج البحث (يمكن تعديل هذا الجزء حسب احتياجاتك)
            this.showSearchResults(query);
            
            // إضافة إلى سجل البحث
            this.addToSearchHistory(query);
        } else {
            this.showNotification('يرجى كتابة ما تريد البحث عنه', 'warning');
            this.searchInput?.focus();
        }
    }
    
    handleSearchInput() {
        const query = this.searchInput.value.trim();
        
        // هنا يمكنك إضافة اقتراحات البحث التلقائية
        if (query.length >= 2) {
            this.showSearchSuggestions(query);
        }
    }
    
    showSearchResults(query) {
        // هنا يمكنك عرض نتائج البحث
        console.log('بحث عن:', query);
        
        // إظهار رسالة توضيحية (يمكن استبدالها بنتائج حقيقية)
        this.showNotification(`جارٍ البحث عن: "${query}"`, 'info');
    }
    
    showSearchSuggestions(query) {
        // هنا يمكنك إضافة اقتراحات بحث ذكية
        const suggestions = [
            'ديكور مقاوم للرطوبة في جدة',
            'أفكار ديكور لغرف النوم في جدة',
            'تصميم مطابخ جدة الحديثة',
            'ديكور فلل في حي الروضة جدة',
            'ألوان ديكور تناسب جو جدة'
        ];
        
        // عرض الاقتراحات (يمكن تنفيذ واجهة مناسبة)
        console.log('اقتراحات البحث:', suggestions.filter(s => s.includes(query)));
    }
    
    addToSearchHistory(query) {
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const timestamp = new Date().toISOString();
        
        // إضافة البحث الجديد
        searchHistory.unshift({ query, timestamp });
        
        // حفظ فقط آخر 10 عمليات بحث
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 10)));
    }
    
    showNotification(message, type) {
        // استخدام نفس دالة الإشعارات من PortfolioManager
        if (window.portfolioManager) {
            window.portfolioManager.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// ===== إدارة أحياء جدة =====
class JeddahDistricts {
    constructor() {
        this.districtButtons = document.querySelectorAll('.explore-district');
        this.init();
    }
    
    init() {
        this.districtButtons.forEach(button => {
            button.addEventListener('click', () => {
                const district = button.dataset.area;
                this.exploreDistrict(district);
            });
        });
    }
    
    exploreDistrict(district) {
        const districtsInfo = {
            north: {
                title: 'شمال جدة',
                description: 'مناطق ساحلية تحتاج لديكور مقاوم للرطوبة والعفن. ننصح باستخدام مواد مقاومة للملوحة وألوان فاتحة.',
                tips: [
                    'استخدام الدهانات المقاومة للعفن',
                    'اختيار أثاث من مواد صناعية مقاومة للملوحة',
                    'تركيب نوافذ مزدوجة العزل',
                    'استخدام ألوان فاتحة تعكس الحرارة'
                ]
            },
            central: {
                title: 'وسط جدة',
                description: 'مناطق حيوية تحتاج لديكور عملي وأنيق. التركيز على استغلال المساحات والتخزين الذكي.',
                tips: [
                    'تصميم خزائن مدمجة في الجدران',
                    'استخدام ألوان محايدة تناسب الأجواء الحضرية',
                    'تركيب إضاءة LED موفرة للطاقة',
                    'اختيار أثاث متعدد الوظائف'
                ]
            },
            south: {
                title: 'جنوب جدة',
                description: 'مناطق سكنية هادئة تناسب الديكور العائلي. التركيز على الراحة والخصوصية.',
                tips: [
                    'إنشاء مساحات عائلية مشتركة',
                    'استخدام مواد عازلة للصوت',
                    'تصميم حدائق داخلية صغيرة',
                    'اختيار ألوان دافئة ومريحة'
                ]
            },
            historical: {
                title: 'جدة التاريخية',
                description: 'الحفاظ على التراث مع لمسات عصرية. دمج العناصر التقليدية مع التقنيات الحديثة.',
                tips: [
                    'ترميم الرواشين الخشبية الأصلية',
                    'استخدام الحجر المنقبي في التصميم',
                    'دمج الإضاءة الحديثة مع الزخارف التقليدية',
                    'الحفاظ على الأفنية الداخلية'
                ]
            }
        };
        
        const info = districtsInfo[district];
        if (!info) return;
        
        // عرض معلومات الحي
        const message = `${info.title}\n\n${info.description}\n\nنصائح:\n${info.tips.map(tip => `• ${tip}`).join('\n')}`;
        
        if (window.portfolioManager) {
            window.portfolioManager.showNotification(`جاري تحميل أفكار ديكور لـ ${info.title}...`, 'info');
        }
        
        // هنا يمكنك تحميل مشاريع خاصة بالحي
        this.loadDistrictProjects(district);
    }
    
    loadDistrictProjects(district) {
        // محاكاة تحميل المشاريع الخاصة بالحي
        setTimeout(() => {
            if (window.portfolioManager) {
                window.portfolioManager.showNotification(`تم تحميل أفكار ديكور للحي المحدد`, 'success');
            }
        }, 1500);
    }
}

// ===== إدارة النشرة البريدية =====
class NewsletterManager {
    constructor() {
        this.newsletterForm = document.querySelector('.newsletter-form');
        this.init();
    }
    
    init() {
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.subscribe();
            });
        }
    }
    
    subscribe() {
        const emailInput = this.newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!this.validateEmail(email)) {
            this.showError('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }
        
        // محاكاة إرسال الطلب
        emailInput.disabled = true;
        const submitBtn = this.newsletterForm.querySelector('button');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            // حفظ الاشتراك
            this.saveSubscription(email);
            
            // إظهار رسالة النجاح
            this.showSuccess('تم الاشتراك بنجاح! سيصلك آخر أخبار ديكور جدة.');
            
            // إعادة تعيين النموذج
            emailInput.value = '';
            emailInput.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    saveSubscription(email) {
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        const subscription = {
            email: email,
            date: new Date().toISOString(),
            source: 'website'
        };
        
        // التحقق من عدم تكرار الاشتراك
        if (!subscriptions.some(sub => sub.email === email)) {
            subscriptions.push(subscription);
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        }
    }
    
    showError(message) {
        if (window.portfolioManager) {
            window.portfolioManager.showNotification(message, 'error');
        }
    }
    
    showSuccess(message) {
        if (window.portfolioManager) {
            window.portfolioManager.showNotification(message, 'success');
        }
    }
}

// ===== تهيئة الموقع عند التحميل =====
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة جميع المكونات
    const themeManager = new ThemeManager();
    const progressBar = new ProgressBar();
    const heroSlider = new HeroSlider();
    const portfolioManager = new PortfolioManager();
    const mobileMenu = new MobileMenu();
    const searchManager = new SearchManager();
    const jeddahDistricts = new JeddahDistricts();
    const newsletterManager = new NewsletterManager();
    
    // جعل portfolioManager متاحاً globally للوظائف الأخرى
    window.portfolioManager = portfolioManager;
    
    // تهيئة أحداث إضافية
    initScrollEvents();
    initFloatingButtons();
    initLazyLoading();
    initPerformanceMonitoring();
    initAnalytics();
    
    console.log('✅ موقع ديكور آرت جدة تم تحميله بنجاح!');
});

// ===== أحداث التمرير =====
function initScrollEvents() {
    // تأثير التمرير على الهيدر
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // تفعيل تأثيرات Parallax
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        
        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed'));
            const yPos = -(scrolled * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== أزرار التعويم =====
function initFloatingButtons() {
    // زر الانتقال للأعلى
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // تأثيرات hover للأزرار العائمة
    const floatButtons = document.querySelectorAll('.float-btn');
    floatButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-5px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('scroll-top-btn') || window.scrollY <= 500) {
                this.style.transform = 'scale(1) translateY(0)';
            }
        });
    });
}

// ===== تحميل كسول للصور =====
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== مراقبة الأداء =====
function initPerformanceMonitoring() {
    window.addEventListener('load', function() {
        // قياس وقت التحميل
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        if (loadTime < 3000) {
            console.log(`✅ وقت تحميل الموقع: ${loadTime}ms (ممتاز)`);
        } else if (loadTime < 5000) {
            console.log(`⚠️ وقت تحميل الموقع: ${loadTime}ms (جيد)`);
        } else {
            console.log(`🚨 وقت تحميل الموقع: ${loadTime}ms (يحتاج تحسين)`);
        }
        
        // حفظ إحصاءات الأداء
        const perfStats = JSON.parse(localStorage.getItem('performanceStats') || '[]');
        perfStats.push({
            loadTime: loadTime,
            date: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        
        // حفظ فقط آخر 100 سجل
        localStorage.setItem('performanceStats', JSON.stringify(perfStats.slice(-100)));
    });
}

// ===== إحصاءات وتحليلات =====
function initAnalytics() {
    // تتبع زوار الموقع
    const visitData = {
        page: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language
    };
    
    // حفظ بيانات الزيارة
    const visits = JSON.parse(localStorage.getItem('siteVisits') || '[]');
    visits.push(visitData);
    localStorage.setItem('siteVisits', JSON.stringify(visits.slice(-1000)));
    
    // تتبع الأحداث المهمة
    document.addEventListener('click', function(e) {
        const clickedElement = e.target;
        
        // تتبع النقر على روابط التواصل
        if (clickedElement.closest('.whatsapp-btn, .phone-btn')) {
            logEvent('contact_click', {
                type: clickedElement.closest('.whatsapp-btn') ? 'whatsapp' : 'phone'
            });
        }
        
        // تتبع النقر على مشاريع
        if (clickedElement.closest('.portfolio-item')) {
            const projectId = clickedElement.closest('.portfolio-item').dataset.id;
            logEvent('project_view', { projectId: projectId });
        }
        
        // تطلع النقر على أقسام الموقع
        if (clickedElement.closest('.nav-link')) {
            const section = clickedElement.closest('.nav-link').getAttribute('href');
            logEvent('section_click', { section: section });
        }
    });
    
    function logEvent(eventName, eventData) {
        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
        };
        
        const events = JSON.parse(localStorage.getItem('siteEvents') || '[]');
        events.push(event);
        localStorage.setItem('siteEvents', JSON.stringify(events.slice(-500)));
    }
}

// ===== Service Worker للتخزين المؤقت =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registered successfully');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// ===== دعم المتصفحات القديمة =====
(function() {
    // دعم classList للمتصفحات القديمة
    if (!("classList" in document.documentElement)) {
        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/);
                        var index = classes.indexOf(value);
                        
                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    };
                }
                
                return {
                    add: update(function(classes, index, value) {
                        if (!~index) classes.push(value);
                    }),
                    
                    remove: update(function(classes, index) {
                        if (~index) classes.splice(index, 1);
                    }),
                    
                    toggle: update(function(classes, index, value) {
                        if (~index)
                            classes.splice(index, 1);
                        else
                            classes.push(value);
                    }),
                    
                    contains: function(value) {
                        return !!~self.className.split(/\s+/).indexOf(value);
                    }
                };
            }
        });
    }
})();