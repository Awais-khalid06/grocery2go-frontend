import {useContext, useEffect} from 'react';
import {useSelector} from 'react-redux';
import SocketContext from '../context/context/socketContext';
import {userSelector} from '../redux/selectors';

const useSocket = () => {
  const socket = useContext(SocketContext);
  const user = useSelector(userSelector) || {};

  useEffect(() => {
    socket.connect();
    socket.emit('user-enter', {userId: user?._id});
  }, []);

  return socket;
};

export default useSocket;
