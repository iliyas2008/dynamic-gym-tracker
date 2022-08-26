import moment from "moment";
import { ACCOUNT_NO_VALIDATED, EMAIL_IN_USE, INCOMPETE_AUTH, USER_EXIST_WITH_OTHER_ACCOUNT, USER_NOT_FOUND } from "../constants";

export const getErrorFirebase = (err) => {
  switch (err) {
    case USER_NOT_FOUND:
      return "Unregistered user.";
    case EMAIL_IN_USE:
      return "This account is already registered.";
    case ACCOUNT_NO_VALIDATED:
      return "The account needs to be validated.";
    case USER_EXIST_WITH_OTHER_ACCOUNT:
      return "The user is registered with other credentials.";
    case INCOMPETE_AUTH:
      return "You did not complete the authentication.";
    default:
      return "We seem to have trouble submitting the information.";
  }
};

export const fireBaseDate = (dateTimestamp) =>
  new Date(dateTimestamp.seconds * 1000 + dateTimestamp.nanoseconds / 1000000);

export const daysUntilBirthday = (date) =>{
    var birthday = moment(date).format("YYYY-MM-DD");
    
    // uncomment this line to simulate it is your birthday and comment the next one to test it.
    // var today = moment("2017-03-25");
    var today = moment().format("YYYY-MM-DD");
    
    // calculate age of the person
    var age = moment(today).diff(birthday, 'years');
    moment(age).format("YYYY-MM-DD");
    // console.log('person age', age);
    
    var nextBirthday = moment(birthday).add(age, 'years');
    moment(nextBirthday).format("YYYY-MM-DD");
    
    /* added one more year in case the birthday has already passed
    to calculate date till next one. */
    if (nextBirthday.isSame(today)) {
      return 0;
    } else {
      nextBirthday = moment(birthday).add(age + 1, 'years');
      return nextBirthday.diff(today, 'days');
    }
  }
export const capitalize = (s) => {return (s && s[0].toUpperCase() + s.slice(1)) || ""}

export const getGreetingTime = (currentTime) => {
  if (!currentTime || !currentTime.isValid()) { return 'Welcome !'; }

  const splitAfternoon = 12; // 24hr time to split the afternoon
  const splitEvening = 17; // 24hr time to split the evening
  const currentHour = parseFloat(currentTime.format('HH'));

  if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
    // Between 12 PM and 5PM
    return 'Good afternoon';
  } else if (currentHour >= splitEvening) {
    // Between 5PM and Midnight
    return 'Good evening';
  }
  // Between dawn and noon
  return 'Good morning';
}