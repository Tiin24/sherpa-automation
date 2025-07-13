async function solveBinarySearchChallenge(apiResponse, century) {
  const { vault, targets, hint } = apiResponse.challenge;

  console.log(`🔍 Resolviendo desafío de búsqueda binaria para el siglo ${century}...`);
  console.log('💡 Pista:', hint);

  const sortedVault = [...vault].sort();

  function binarySearch(arr, targetIndex) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (mid === targetIndex - 1) {
        return arr[mid];
      } else if (mid < targetIndex - 1) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return null;
  }

  const passwordChars = targets.map(target => {
    const char = binarySearch(sortedVault, target);
    if (!char) throw new Error(`No se encontró caracter para índice ${target}`);
    return char;
  });

  const password = passwordChars.join('');

  console.log(`🔑 Contraseña descifrada para el siglo ${century}:`, password);
  return {
    password,
    bookTitle: apiResponse.challenge.bookTitle
  };
}

module.exports = { solveBinarySearchChallenge };