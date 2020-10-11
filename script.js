const deleteTodo = id => {
    const response = fetch(`/delete/${id}`, {
      method: 'DELETE',
      redirect: 'follow'
    });
    location.href = "/";
    return response;
  }