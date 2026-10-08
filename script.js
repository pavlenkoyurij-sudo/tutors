       // Функція для екранування, захист від XSS атак
       const esc = s => String(s ?? '').replace(/[&<>"']/g,
            c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
       
       
       const supabaseUrl = "https://kvnivreuwjgxqekaswed.supabase.co";
        const supabaseKey = "sb_publishable_lFliydUt3DSoAuntl79FdA_zHUVZpga";

        const supabaseClient = window.supabase.createClient(
            supabaseUrl,
            supabaseKey
        );

        let tutors = [];
        let selectedCategory = "all";
        let selectedCity = "";
          
            
        async function loadTutors() {
            const { data, error } = await supabaseClient
                .from("tutors")
                .select("*")
                
                .eq("approved", true);
            if (error) {
                console.error(error);
               return;
            }
            tutors = data;
            //Функція сортування репетиторів по рейтингу
            tutors.sort((a, b) =>
                (Number(!!b.isPremium) - Number(!!a.isPremium)) ||
                ((b.rating ?? 0) - (a.rating ?? 0))
            );

            renderTutors();

        }
            

        
        
        
        
        

        function filterTutors(category) {
            selectedCategory = category;
            applyFilters();
        }

        function selectByCity() {//фушкція пошуку міста
            selectedCity = document
                .getElementById("citySearch")
                .value
                .toLowerCase()
                .trim();

            applyFilters();
        }

        function applyFilters() {
            document.querySelectorAll(".tutor-card").forEach(card => {

                const category = card.dataset.category;

                const city = card
                    .querySelector(".tutor-city")
                    .textContent
                    .toLowerCase();

                const categoryMatch =
                    selectedCategory === "all" ||
                    category === selectedCategory;

                const cityMatch =
                    selectedCity === "" ||
                    city.includes(selectedCity);

                card.style.display =
                    categoryMatch && cityMatch ? "" : "none";
            });
        }

        function selectAllCities() {
            document.getElementById('citySearch').value = "";
            selectedCity = "";
            applyFilters();
        }

      
                



        

         

        //місцеве сховище дл фаворитів
        let favorites = JSON.parse(
            localStorage.getItem("favorites")
        ) || [];


        
            

            
        const tutorGrid = document.getElementById("tutorGrid");
        const categoryNames = {
            ukrainian: "Українська мова",
            ukrainianLiterature: "Українська література",
            english: "Англійська мова",
            german: "Німецька мова",
            polish: "Польська мова",
            french: "Французька мова",
            mathematics: "Математика",
            "physics": "Фізика",
            "chemistry": "Хімія",
            "biology": "Біологія",
            "geography": "Географія",
            "history": "Історія",
            "informatics": "Інформатика",
            "painting": "Малювання",
            "music": "Музика",
            "others": "Інше",
            "psychologist": "Послуги психолога",
            "speech-therapist": "Послуги логопеда",
            "defectologist": "Послуги дефектолога",
            
        };

        function renderTutors() {

            tutorGrid.innerHTML = "";

            tutors.forEach(tutor => {
                

                tutorGrid.innerHTML += `
                    <div class="tutor-card ${tutor.isPremium ? 'premium' : ''}"
                        data-category="${esc(tutor.category)}"
                        onclick="openTutorModal(${tutor.id})">

                        <img src="${esc(tutor.photo)}"
                            alt="${esc(tutor.name)}"
                            onerror="this.onerror=null; this.src='images/default.jpeg';"> 
                            
                        <div class="tutor-name-row">
                            <h3>${esc(tutor.name)}</h3>
                            ${tutor.isPremium ? `<span class="badge-top">TOP</span>` : ""}
                        </div>

                        <p>🖋️${categoryNames[tutor.category] || tutor.category}</p>
                        <p class="tutor-description">📜${esc(tutor.description) || 'Надання професійних послуг в нашому місті'}</p>

                        <p>⭐${tutor.rating ?? "Новий"}
                        (${tutor.reviews ?? 0} відгуків)
                        </p>

                        <p>
                            🏆${esc(tutor.experience)} років досвіду
                        </p>

                        <p>📚 Формат занять:
                            ${[
                                tutor.online ? "💻 Онлайн" : "",
                                tutor.at_home ? "🏠 У фахівця" : "",
                                tutor.visit_student ? "🚗 Виїзд фахівця" : ""
                            ].filter(Boolean).join(".")}
                        </p>

                        <p>💰${esc(tutor.price) || 'Ціна не вказана'}</p>

                        <p class="tutor-city">📍${esc(tutor.city)}</p>
                            
                        <a class="call-btn"
                            href="tel:${esc(tutor.phone)}" 
                            onclick="event.stopPropagation()">
                            📞Подзвонити
                        </a>

                        <button class="favorite-btn" data-id="${tutor.id}" onclick="toggleFavorite(event, ${tutor.id})">
                         ⭐ В обране
                        </button>
                        
                        ${tutor.isPremium && tutor.page ? `
                        <a class="premium-btn"
                        href="${tutor.page}"
                        onclick="event.stopPropagation()">
                        Детальніше:
                         </a>
                        ` : ""}
                        

                            
                    </div>
                `; 
            });

            renderFavorites();
        }
      
        



        loadTutors(); //рендерить список tytor;
        
        

                //Функція додавання та видалення репетитора з фаворитів
        function toggleFavorite(event, tutorId) {
            // Зупиняємо вспливання події, щоб не відкривалася модалка
            event.stopPropagation();

            tutorId = Number(tutorId);

            if (favorites.includes(tutorId)) {
                favorites = favorites.filter(id => id !== tutorId);
            } else {
                favorites.push(tutorId);
            }

            localStorage.setItem("favorites", JSON.stringify(favorites));
            renderFavorites();
        }


        function renderFavorites() {
            document.querySelectorAll(".favorite-btn").forEach(btn => {
                const id = Number(btn.dataset.id);

                if (favorites.includes(id)) {
                    btn.textContent = "❤️ В обраному";
                    btn.classList.add("active");
                } else {
                    btn.textContent = "⭐ В обране";
                    btn.classList.remove("active");
                }
            });
        }



        // Логіка модального вікна
        const modal = document.getElementById("tutorModal");

        function openTutorModal(id) {
            // Знаходимо репетитора в масиві за id
            const tutor = tutors.find(m => m.id === id);
            if (!tutor) return;

            // Отримуємо зрозумілу назву категорії зі словника categoryNames
            const categoryTitle = categoryNames[tutor.category] || tutor.profession || tutor.category;

            // Заповнюємо дані в модалці
            document.getElementById("modalName").textContent = tutor.name;
            document.getElementById("modalId").textContent = "🆔 " + tutor.id;
            document.getElementById("modalProfession").textContent = "🖋️ " + categoryTitle; // 👈 Вже не буде undefined!
            document.getElementById("modalExperience").textContent = "🏆 Досвід: " + tutor.experience + " років";
            document.getElementById("modalCity").textContent = "📍 " + tutor.city;
            document.getElementById("modalDescription").textContent = tutor.description || "Опис відсутній.";
            const format = [
                tutor.online ? "💻 Онлайн" : "",
                tutor.at_home ? "🏠 У фахівця" : "",
                tutor.visit_student ? "🚗 Виїзд фахівця" : ""
            ].filter(Boolean).join(".");

            document.getElementById("modalFormat").textContent =
            "📚 Формат занять: " + (format || "Не вказано");

            document.getElementById("modalPrice").textContent =
            tutor.price ? "💰 " + tutor.price : "💰 Ціна не вказана";
            

            document.getElementById("modalCallBtn").href = "tel:" + tutor.phone;
            
            const photoEl = document.getElementById("modalPhoto");
            photoEl.src = tutor.photo || 'images/default.jpeg';
            photoEl.onerror = () => { photoEl.src = 'images/default.jpeg'; };

            // Відкриваємо вікно
            modal.showModal();
        }

        function closeTutorModal() {
            modal.close();
        }

        // Закриття при кліку на вільну частину екрана (на затемнений фон backdrop)
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.close();
            }
        });




         //робота блоку ФАК
        function toggleFAQ(question) {

            let answer = question.nextElementSibling;

            //перевіряємо чи саме ця відповідь відкрита
            let isOpen = answer.classList.contains('open');

            //закриваємо всі інші відповіді
            document.querySelectorAll('.faq-answer').forEach(ans => {
                if (ans !== answer) {         
                    ans.classList.remove('open');
                }
            });

            //якщо поточна була відкрита - закриваємо її, якщо закрита - відкриваємо
            answer.classList.toggle('open');
        }
                                
                       



               
           //кнопка повернення догори    
        const btn = document.getElementById("scrollToTopBtn");       
               
               //показує кнопку, коли юзер прокручує сторінку до низу
        window.addEventListener("scroll", () => {
            btn.classList.toggle(
                "show",
                window.scrollY > 300
            );
        });
            

        
                //прокручує сторінку плавно до самого верху при натисканні
        btn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"//забезпечує плавний скролінг
            });
        });
