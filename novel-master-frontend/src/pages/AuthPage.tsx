  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        // Ensure email and password keys match exactly what your Flask app expects
        await login({ 
          email: formData.email, 
          password: formData.password 
        });
        toast.success('Welcome back, storyteller!');
      } else {
        // Flask endpoints sometimes struggle if the payload structure is nested 
        // or missing expected fields. Ensure these keys match your backend route.
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          display_name: formData.display_name
        });
        toast.success('Account created! Welcome to Novel Master.');
      }
      navigate('/');
    } catch (err: any) {
      // Improved error logging to help you see exactly why the 400 is happening
      console.error('Full error details:', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Registration failed. Check console.');
    }
  };
