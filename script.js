const apiKey = 'fcac5903069dccb32ce780846682b374'; // Thay bằng API Key của bạn từ OpenWeatherMap
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('error-message');

cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value;
    cityInput.classList.remove('error'); // Loại bỏ class 'error' trước khi thực hiện tìm kiếm mới
    errorMessage.textContent = ''; // Xóa thông báo lỗi trước đó
    cityInput.placeholder = 'Nhập tên thành phố...'; // Đặt lại placeholder mặc định

    if (!city) {
        cityInput.classList.add('error'); // Thêm class 'error' nếu không có tên thành phố
        errorMessage.textContent = 'Vui lòng nhập tên thành phố!';
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=vi`);
        if (!response.ok) {
            throw new Error('Không tìm thấy thành phố!');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        cityInput.classList.add('error'); // Thêm class 'error' khi có lỗi
        errorMessage.textContent = error.message; // Hiển thị thông báo lỗi
        weatherInfo.style.display = 'none'; // Ẩn thông tin thời tiết nếu đang hiển thị
    }
}

function displayWeather(data) {
    weatherInfo.style.display = 'block';
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = `Nhiệt độ: ${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = `Thời tiết: ${data.weather[0].description}`;
    document.getElementById('humidity').textContent = `Độ ẩm: ${data.main.humidity}%`;
    document.getElementById('wind').textContent = `Tốc độ gió: ${data.wind.speed} m/s`;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    suggestActivities(data.weather[0].main, data.main.temp);
}

function suggestActivities(weather, temp) {
    const suggestionList = document.getElementById('suggestionList');
    suggestionList.innerHTML = '';

    let suggestions = [];
    if (weather.includes('Rain')) {
        suggestions = [
            'Ở nhà xem phim hoặc đọc sách.',
            'Chuẩn bị ô và áo mưa nếu cần ra ngoài.',
            'Thưởng thức một tách trà nóng.',
            'Hòa mình vào những giai điệu êm dịu.'
        ];
    } else if (weather.includes('Clear')) {
        suggestions = [
            'Đi dạo công viên hoặc tập thể dục ngoài trời.',
            'Tổ chức một buổi picnic cùng bạn bè.',
            'Chụp ảnh phong cảnh dưới ánh nắng.',
            'Chăm sóc cây cối hoặc trồng thêm hoa và rau.'
        ];
    } else if (weather.includes('Clouds')) {
        suggestions = [
            'Thăm bảo tàng hoặc triển lãm nghệ thuật.',
            'Đi cà phê với bạn bè.',
            'Tập yoga trong nhà để thư giãn.',
            'Học vẽ, viết, làm đồ thủ công.'
        ];
    } else if (weather.includes('Snow')) {
        suggestions = [
            'Xây người tuyết hoặc chơi ném tuyết.',
            'Giữ ấm với quần áo dày và khăn quàng.',
            'Uống chocolate nóng bên lò sưởi.'
        ];
    }

    if (temp > 30) {
        suggestions.push('Uống đủ nước và tránh tiếp xúc trực tiếp với ánh nắng trong thời gian dài.');
    } else if (temp < 10) {
        suggestions.push('Mặc nhiều lớp áo, uống nước ấm và tránh gió lạnh.');
    }

    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionList.appendChild(li);
    });
}