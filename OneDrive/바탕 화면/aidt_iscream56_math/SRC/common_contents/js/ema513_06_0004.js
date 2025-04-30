initializeCustomDropdowns(
  function handleOnChange(e) {
    // 선택된 데이터의 텍스트값 가져오기
    const text = e.options[e.selectedIndex].text;
    
    console.log(e.options);
    
    // 선택한 텍스트 출력
    document.getElementById('result').innerText
      = text;
  }
); 
