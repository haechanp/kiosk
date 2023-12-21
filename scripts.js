function changeLanguage(language) {
  if (language === 'ko') {
    $('#kiosk-title').text('하루탕후루');
    updateAllTexts(language);
  } else if (language === 'en') {
    $('#kiosk-title').text('Haru Tanghulu');
    updateAllTexts(language);
  } else if (language === 'ja') {
    $('#kiosk-title').text('ハルタンフル');
    updateAllTexts(language);
  }
  // 나머지 코드는 그대로 유지합니다.
}

function updateAllTexts(language) {
  updateMenuItemText('딸기', getTranslatedText('딸기', language));
  updateMenuItemText('블루베리', getTranslatedText('블루베리', language));
  updateMenuItemText('산타', getTranslatedText('산타', language));
  updateMenuItemText('통귤', getTranslatedText('통귤', language));
  updateMenuItemText('아도라포도', getTranslatedText('아도라포도', language));
  updateMenuItemText('스테비아토망고', getTranslatedText('스테비아토망고', language));
  updateMenuItemText('샤인머스켓', getTranslatedText('샤인머스켓', language));

  // 주문 내역, 계산하기, 총 가격 텍스트도 추가로 업데이트합니다.
  $('#order-summary h2').text(getTranslatedText('주문 내역', language));
  $('#calculate-button').text(getTranslatedText('계산하기', language));
  $('#total-price').text(getTranslatedText('총 가격', language));
}

function updateMenuItemText(product, newText) {
  $(`.menu-item[data-product="${product}"] .product-info p:first-child`).text(newText);
}

function getTranslatedText(key, language) {
  const translations = {
    'ko': { '딸기': '딸기', '블루베리': '블루베리', '산타': '산타', '통귤': '통귤', '아도라포도': '아도라포도', '스테비아토망고': '스테비아토망고', '샤인머스켓': '샤인머스켓', '주문 내역': '주문 내역', '계산하기': '계산하기', '총 가격': '총 가격' },
    'en': { '딸기': 'Strawberry', '블루베리': 'Blueberry', '산타': 'Santa', '통귤': 'Tong Tangerine', '아도라포도': 'Adora Grape', '스테비아토망고': 'Stevia Mango', '샤인머스켓': 'Shine Muscat', '주문 내역': 'Order Summary', '계산하기': 'Calculate', '총 가격': 'Total Price' },
    'ja': { '딸기': 'いちご', '블루베리': 'ブルーベリー', '산타': 'サンタ', '통귤': 'トング', '아도라포도': 'アドラぶどう', '스테비아토망고': 'ステビアマンゴー', '샤인머스켓': 'シャインマスカット', '주문 내역': '注文履歴', '계산하기': '計算する', '총 가격': '合計価格' },
  };

  return translations[language][key] || key;
}

$(document).ready(function() {
  var orderDetails = []; // 주문 상세 정보를 저장하는 배열
  var totalPrice = 0; // 총 가격

  $('.product-image').on('click', function() {
    var productName = $(this).data('product');
    addProduct(productName);
    updateOrderSummary();
  });

  $('#order-summary').on('click', '.decrease-button', function() {
    var index = $(this).data('index');
    decreaseQuantity(index);
    updateOrderSummary();
  });

  $('#order-summary').on('click', '.increase-button', function() {
    var productName = $(this).data('product');
    addProduct(productName);
    updateOrderSummary();
  });

  $('#calculate-button').on('click', function() {
    openPaymentPopup();
  });

  $('#add-quantity-button').on('click', function() {
    var productName = prompt('추가할 상품을 입력해주세요 (딸기, 블루베리 등):');
    addProduct(productName);
    updateOrderSummary();
  });

  function openPaymentPopup() {
    var popup = window.open('', 'paymentPopup', 'width=400,height=300');

    var popupContent = `
      <h2>결제 수단을 선택해주세요</h2>
      <label>
        <input type="radio" name="payment-method" value="card"> 카드/페이 결제
      </label>
      <br>
      <label>
        <input type="radio" name="payment-method" value="gift-card"> 기프티콘 결제
      </label>
      <br>
      <button id="confirm-payment">확인</button>
    `;

    popupContent += `
      <style>
        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 10px;
        }
        button {
          display: block;
          margin: 20px auto;
          padding: 10px 20px;
          background-color: #5bc0de;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      </style>
    `;

    popup.document.body.innerHTML = popupContent;

    popup.document.getElementById('confirm-payment').addEventListener('click', function() {
      var selectedPaymentMethod = popup.document.querySelector('input[name="payment-method"]:checked');

      if (selectedPaymentMethod) {
        // 화면을 새로운 내용으로 갱신
        popup.document.body.innerHTML = getCardPaymentContent();

        // 일정 시간 후에 결제가 완료되었다는 팝업 표시
        setTimeout(function() {
          showCardPaymentCompletePopup(popup);
        }, 5000);
      } else {
        alert('결제 수단을 선택해주세요.');
      }
    });
  }

  function getCardPaymentContent() {
    return `
      <h2>카드를 넣어주세요</h2>
      <img src="your_custom_card_image.jpg" alt="Custom Card Image" style="max-width: 100%;">
      <p>카드를 투입구에 넣어주세요.</p>
    `;
  }

  function showCardPaymentCompletePopup(popup) {
    popup.document.body.innerHTML = `
      <h2>결제가 완료되었습니다</h2>
      <p>카드를 제거해주세요.</p>
    `;
  }

  function addProduct(productName) {
    var existingOrder = orderDetails.find(order => order.product === productName);

    if (existingOrder) {
      existingOrder.quantity += 1;
    } else {
      orderDetails.push({ product: productName, quantity: 1 });
    }
  }

  function decreaseQuantity(index) {
    var order = orderDetails[index];
    if (order && order.quantity > 0) {
      order.quantity -= 1;
      if (order.quantity === 0) {
        orderDetails.splice(index, 1);
      }
    }
  }

  function updateOrderSummary() {
    var $orderList = $('#order-list');
    $orderList.empty();

    totalPrice = 0;

    orderDetails.forEach(function(order, index) {
      var productPrice = getProductPrice(order.product);
      totalPrice += productPrice * order.quantity;

      $orderList.append(
        `<li class="order-item">
          ${order.product} - ${order.quantity}개, 가격: ${productPrice * order.quantity}원
          <button class="decrease-button" data-index="${index}">-</button>
          <button class="increase-button" data-product="${order.product}">+</button>
        </li>`
      );
    });

    $('#total-price').text(totalPrice + '원');
  }

  function getProductPrice(productName) {
    switch (productName) {
      case '딸기':
      case '블루베리':
      case '아도라포도':
      case '스테비아토망고':
        return 3000;
      case '샤인머스켓':
      case '산타':
      case '통귤':
        return 4000;
      default:
        return 0;
    }
  }
});