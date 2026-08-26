import os
import re
import win32com.client

def natural_keys(text):
    return [int(c) if c.isdigit() else c.lower() for c in re.split(r'(\d+)', text)]

def merge_specific_presentations(folder_path, output_filename, keyword):
    ppt_app = win32com.client.Dispatch("PowerPoint.Application")
    ppt_app.Visible = True

    master_ppt = ppt_app.Presentations.Add()

    files = [f for f in os.listdir(folder_path) 
             if f.endswith((".pptx", ".ppt")) and keyword.lower() in f.lower()]
    
    files.sort(key=natural_keys)

    if not files:
        print(f"\n[알림] '{keyword}'(이)가 포함된 PPT 파일이 없습니다. 다음 키워드로 넘어갑니다.")
        master_ppt.Close()
        return

    for file in files:
        file_path = os.path.join(folder_path, file)
        try:
            master_ppt.Slides.InsertFromFile(file_path, master_ppt.Slides.Count)
        except Exception as e:
            print(f"'{file}' 병합 중 에러 발생: {e}")

    # 최종 파일 저장 및 닫기
    output_path = os.path.join(folder_path, output_filename)
    master_ppt.SaveAs(output_path)
    master_ppt.Close() # 저장이 끝난 파일은 닫아서 메모리를 정리합니다.
    
    print(f"\n✅ 총 {len(files)}개의 '{keyword}' 파일 병합 완료: {output_filename}")
    print("   병합된 파일 순서:")
    for idx, f in enumerate(files, 1):
        print(f"    {idx}. {f}")

if __name__ == "__main__":
    # 실제 파일이 있는 폴더 경로 (필요시 수정하세요)
    TARGET_FOLDER = r"C:\Users\배윤종(한미약품데이터사이언스파트)\OneDrive - hanmi.co.kr\바탕 화면\새 폴더\all\30d\5yr" 
    
    # [핵심 수정 부분] 연속으로 병합할 키워드 리스트
    KEYWORDS = ["pacemaker","reintervention","endo","kidney","mi"]
    
    print("연속 병합 작업을 시작합니다...")
    
    # 리스트 안의 키워드를 하나씩 꺼내서 순서대로 실행
    for current_keyword in KEYWORDS:
        # 키워드에 맞춰 저장될 파일 이름을 자동으로 생성 (예: Merged_heart_Sorted.pptx)
        OUTPUT_NAME = f"kmplot_{current_keyword}_all_5yr.pptx"
        
        merge_specific_presentations(TARGET_FOLDER, OUTPUT_NAME, current_keyword)
        
    print("\n🎉 모든 병합 작업이 성공적으로 끝났습니다!")