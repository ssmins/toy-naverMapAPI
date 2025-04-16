// extract-yangsan.js
const fs = require('fs');
const path = require('path');

// 경로 설정
const knDistrictsPath = path.join(__dirname, 'public', 'data', 'kn_districts.json');
const outputPath = path.join(__dirname, 'public', 'data', 'yangsan_districts.json');

// 경상남도 데이터 파일 읽기
try {
  console.log('경상남도 지역 데이터 파일 읽는 중...');
  const knDistrictsData = fs.readFileSync(knDistrictsPath, 'utf8');
  const knDistricts = JSON.parse(knDistrictsData);
  
  console.log(`총 ${knDistricts.features.length}개의 지역 데이터 발견`);
  
  // 양산시 데이터만 필터링
  const yangsanFeatures = knDistricts.features.filter(feature => {
    const props = feature.properties;
    return (
      props.sgg === "48330" || 
      (props.adm_nm && props.adm_nm.includes("양산시")) ||
      (props.sggnm && props.sggnm === "양산시")
    );
  });
  
  console.log(`양산시 관련 데이터 ${yangsanFeatures.length}개 찾음`);
  
  if (yangsanFeatures.length > 0) {
    // 양산시 데이터만 포함하는 새로운 GeoJSON 객체 생성
    const yangsanGeoJSON = {
      type: knDistricts.type,
      name: "yangsan",
      crs: knDistricts.crs,
      features: yangsanFeatures
    };
    
    // 파일로 저장
    fs.writeFileSync(outputPath, JSON.stringify(yangsanGeoJSON, null, 2));
    console.log(`양산시 데이터가 성공적으로 ${outputPath}에 저장되었습니다.`);
    
    // 데이터가 없는 경우 추가 정보 확인
  } else {
    console.log("양산시 데이터를 찾을 수 없습니다. 가능한 코드와 이름을 확인합니다.");
    
    // 고유한 sgg 코드와 sggnm 값 수집
    const uniqueSgg = new Set();
    const uniqueSggnm = new Set();
    const uniqueAdmNm = new Set();
    
    knDistricts.features.forEach(feature => {
      const props = feature.properties;
      if (props.sgg) uniqueSgg.add(props.sgg);
      if (props.sggnm) uniqueSggnm.add(props.sggnm);
      if (props.adm_nm) uniqueAdmNm.add(props.adm_nm);
    });
    
    console.log("사용 가능한 sgg 코드:", Array.from(uniqueSgg));
    console.log("사용 가능한 시군구 이름 (sggnm):", Array.from(uniqueSggnm));
    console.log("사용 가능한 행정구역 이름 (adm_nm) 일부:", Array.from(uniqueAdmNm).slice(0, 10));
    
    // 양산시가 포함된 행정구역 이름 찾기
    const yangsanRelated = Array.from(uniqueAdmNm).filter(name => name.includes("양산"));
    console.log("'양산'이 포함된 행정구역 이름:", yangsanRelated);
  }
  
} catch (error) {
  console.error("오류 발생:", error);
}