import Swal from "sweetalert2";

export const sweetSuccess = (text: string) => {
  Swal.fire({
    title: "성공!",
    text,
    icon: "success",
  });
};

export const sweetInfo = (text: string) => {
  Swal.fire({
    title: "정보를 확인해주세요.",
    text,
    icon: "info",
  });
};

export const sweetWarning = (text: string) => {
  Swal.fire({
    title: "잠깐!",
    text,
    icon: "warning",
  });
};

export const sweetError = (text: string) => {
  Swal.fire({
    title: "정보를 확인해주세요.",
    text,
    icon: "error",
  });
};

export const sweetConfirm = (onConfirm: () => void,title:string,text:string) => {
  Swal.fire({
    title,
    text,
    icon: "warning",

    showCancelButton: true,
    confirmButtonColor: "#525edc",
    cancelButtonColor: "#d33",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire("등록이 완료되었습니다.", "", "success");
    }
  });
};


export const sweetDelete = (onConfirm: () => void) => {
  Swal.fire({
    title: "정말로 삭제하시겠습니까?",
    text: "삭제 후 데이터를 되돌릴 수 없습니다.",
    icon: "warning",

    showCancelButton: true,
    confirmButtonColor: "#525edc",
    cancelButtonColor: "#d33",
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire("삭제가 완료되었습니다.", "", "success");
    }
  });
};

export const sweetEdit = (onConfirm: () => void) => {
  Swal.fire({
    title: "정말로 수정하시겠습니까?",
    icon: "warning",

    showCancelButton: true,
    confirmButtonColor: "#525edc",
    cancelButtonColor: "#d33",
    confirmButtonText: "수정",
    cancelButtonText: "취소",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire("수정이 완료되었습니다.", "", "success");
    }
  });
};

export const sweetLogout = (onConfirm: () => void) => {
  Swal.fire({
    title: "정말로 로그아웃을 하시겠습니까?",
    icon: "question",

    showCancelButton: true,
    confirmButtonColor: "#525edc",
    cancelButtonColor: "#d33",
    confirmButtonText: "로그아웃",
    cancelButtonText: "취소",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire("로그아웃이 완료되었습니다.", "", "success");
    }
  });
};