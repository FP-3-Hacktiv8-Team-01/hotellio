import {useState, createRef} from 'react';
import {emailFormat, passwordFormat} from '../../utils/regexFormat';
import {fireBaseAuthLogin} from '../../services/firebase';
import {TextInput} from 'react-native';
import {AuthStackProps} from '../../navigation/StackNavigation/AuthStackScreen';

export const useLoginScreen = ({navigation}: AuthStackProps) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef<TextInput>();

  const handleSubmitPress = () => {
    setErrortext('');
    setLoading(true);
    if (errorEmail !== '' || errorPassword !== '') {
      setLoading(false);
      setErrortext('Please enter a valid email and password');
      return;
    } else if (userEmail === '') {
      setErrorEmail('Please enter a valid email: eg. example@domain.com');
      setLoading(false);
      return;
    } else if (userPassword === '') {
      setErrorPassword(
        'Invalid: Minimum eight characters, at least one letter and one number',
      );
      setLoading(false);
      return;
    }

    fireBaseAuthLogin({email: userEmail, password: userPassword})
      .then(() => {
        setLoading(false);
      })
      .catch(error => {
        setErrortext(error.code);
        setLoading(false);
      });
  };

  const handleEmailInput = (emailText: string) => {
    if (!emailText.match(emailFormat)) {
      setErrorEmail('Please enter a valid email: eg. example@domain.com');
    } else {
      setErrorEmail('');
      setUserEmail(emailText);
    }
  };

  const handlePasswordInput = (passwordText: string) => {
    if (!passwordText.match(passwordFormat)) {
      setErrorPassword(
        'Invalid: Minimum eight characters, at least one letter and one number',
      );
    } else {
      setErrorPassword('');
      setUserPassword(passwordText);
    }
  };

  const handleToRegister = () => {
    setErrortext('');
    navigation.navigate('Register');
  };

  return {
    loading,
    passwordInputRef,
    errorEmail,
    errorPassword,
    errortext,
    handleEmailInput,
    handlePasswordInput,
    handleToRegister,
    handleSubmitPress,
  } as const;
};
