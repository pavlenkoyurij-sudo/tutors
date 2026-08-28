
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
            tutors.sort((a, b) => b.rating - a.rating);

            renderTutors();

        }
            

        
        
        
        
        

        function filterTutors(category) {
            selectedCategory = category;
            applyFilters();
        }

        function selectByCity() {
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
            
        };

        function renderTutors() {

            tutorGrid.innerHTML = "";

            tutors.forEach(tutor => {
                

                tutorGrid.innerHTML += `
                    <div class="tutor-card"
                        data-category="${tutor.category}"
                        onclick="openTutorModal(${tutor.id})">

                        <img src="${tutor.photo}"
                            alt="${tutor.name}"
                            onerror="this.onerror=null; this.src='images/default.jpeg';"> 
                            
                        <h3>${tutor.name}</h3>

                        <p>🖋️${categoryNames[tutor.category] || tutor.category}</p>
                        <p class="tutor-description">📜${tutor.description || 'Надання професійних послуг в нашому місті'}</p>

                        <p>⭐${tutor.rating}
                        (${tutor.reviews} відгуків)
                        </p>

                        <p>
                            🏆${tutor.experience} років досвіду
                        </p>

                        <p>📚 Формат занять:
                            ${[
                                tutor.online ? "💻 Онлайн" : "",
                                tutor.at_home ? "🏠 У репетитора" : "",
                                tutor.visit_student ? "🚗 Виїзд до учня" : ""
                            ].filter(Boolean).join(".")}
                        </p>

                        <p>💰${tutor.price || 'Ціна не вказана'}</p>

                        <p class="tutor-city">📍${tutor.city}</p>
                            
                        <a class="call-btn"
                            href="tel:${tutor.phone}" 
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
                tutor.at_home ? "🏠 У репетитора" : "",
                tutor.visit_student ? "🚗 Виїзд до учня" : ""
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
                                
                                           




            //Функція пошуку
        


        







               
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
